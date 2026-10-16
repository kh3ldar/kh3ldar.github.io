"""Convert a .docx CV to readable Markdown (stdlib only; pandoc is not installed).

Usage: python -I scripts/docx2md.py content/source/Baris_Kuzu_CV.docx > content/cv.md

Handles heading styles, bold runs, hyperlinks, bulleted/numbered paragraphs,
tables, and headers/footers (as HTML comments). Phone numbers are stripped by
default because the site must not publish one; pass --keep-phone to keep them.
"""
import re
import sys
import zipfile
import xml.etree.ElementTree as ET

W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
R = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}"
PHONE = re.compile(r"\s*·\s*\+\d[\d\s().-]{7,}\d(?=\s*·|\s*$)")


def main(path, keep_phone=False):
    z = zipfile.ZipFile(path)
    doc = ET.fromstring(z.read("word/document.xml"))
    styles = {}
    try:
        st = ET.fromstring(z.read("word/styles.xml"))
        for s in st.iter(W + "style"):
            sid = s.get(W + "styleId")
            n = s.find(W + "name")
            if sid and n is not None:
                styles[sid] = n.get(W + "val")
    except KeyError:
        pass
    rels = {}
    try:
        rr = ET.fromstring(z.read("word/_rels/document.xml.rels"))
        for rel in rr:
            rels[rel.get("Id")] = rel.get("Target")
    except KeyError:
        pass

    def run_text(r):
        out = []
        for ch in r:
            if ch.tag == W + "t":
                out.append(ch.text or "")
            elif ch.tag == W + "tab":
                out.append("\t")
            elif ch.tag in (W + "br", W + "cr"):
                out.append("\n")
        txt = "".join(out)
        rpr = r.find(W + "rPr")
        if txt.strip() and rpr is not None:
            b = rpr.find(W + "b")
            if b is not None and b.get(W + "val", "true") not in ("0", "false"):
                txt = f"**{txt}**"
        return txt

    def para_text(p):
        parts = []
        for ch in p:
            if ch.tag == W + "r":
                parts.append(run_text(ch))
            elif ch.tag == W + "hyperlink":
                inner = "".join(run_text(r) for r in ch.iter(W + "r"))
                tgt = rels.get(ch.get(R + "id"))
                parts.append(f"[{inner}]({tgt})" if tgt else inner)
            elif ch.tag in (W + "ins", W + "smartTag", W + "sdt"):
                parts.append("".join(run_text(r) for r in ch.iter(W + "r")))
        return "".join(parts).replace("****", "")

    def para_meta(p):
        ppr = p.find(W + "pPr")
        style, level, numbered = None, None, False
        if ppr is not None:
            ps = ppr.find(W + "pStyle")
            if ps is not None:
                style = styles.get(ps.get(W + "val"), ps.get(W + "val"))
            numpr = ppr.find(W + "numPr")
            if numpr is not None:
                numbered = True
                il = numpr.find(W + "ilvl")
                level = int(il.get(W + "val")) if il is not None else 0
        return style, numbered, level

    lines = []

    def emit_para(p):
        txt = para_text(p)
        if not keep_phone:
            txt = PHONE.sub("", txt)
        style, numbered, level = para_meta(p)
        if not txt.strip():
            lines.append("")
            return
        m = re.match(r"heading\s*(\d)", (style or ""), re.I)
        if m:
            lines.append("#" * int(m.group(1)) + " " + txt.strip())
        elif style and style.lower() == "title":
            lines.append("# " + txt.strip())
        elif numbered or (style and "list" in style.lower()):
            lines.append("  " * (level or 0) + "- " + txt.strip())
        else:
            lines.append(txt)

    def emit_table(t):
        lines.append("")
        for i, tr in enumerate(t.findall(W + "tr")):
            cells = [
                " <br> ".join(
                    para_text(p).strip() for p in tc.findall(W + "p") if para_text(p).strip()
                ).replace("|", "\\|")
                for tc in tr.findall(W + "tc")
            ]
            lines.append("| " + " | ".join(cells) + " |")
            if i == 0:
                lines.append("|" + "---|" * len(cells))
        lines.append("")

    for el in doc.find(W + "body"):
        if el.tag == W + "p":
            emit_para(el)
        elif el.tag == W + "tbl":
            emit_table(el)
        elif el.tag == W + "sdt":
            for p in el.iter(W + "p"):
                emit_para(p)

    for name in sorted(z.namelist()):
        if re.match(r"word/(header|footer)\d*\.xml", name):
            ht = [para_text(p).strip() for p in ET.fromstring(z.read(name)).iter(W + "p")]
            ht = [h for h in ht if h]
            if ht:
                lines.append(f"\n<!-- {name}: {' / '.join(ht)} -->")

    sys.stdout.reconfigure(encoding="utf-8")
    sys.stdout.write(re.sub(r"\n{3,}", "\n\n", "\n".join(lines)) + "\n")


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if len(args) != 1:
        sys.exit(__doc__)
    main(args[0], keep_phone="--keep-phone" in sys.argv)

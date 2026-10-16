<#
.SYNOPSIS
  Exports content/source/Baris_Kuzu_CV.docx to public/cv/Baris-Kuzu-CV.pdf using Word (COM).
.NOTES
  Needs Microsoft Word installed. Close Word first, or the export runs in a hidden second instance.
  The PDF keeps the phone number on purpose; the website itself must not show it.
#>
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$src  = Join-Path $root 'content\source\Baris_Kuzu_CV.docx'
$dst  = Join-Path $root 'public\cv\Baris-Kuzu-CV.pdf'
New-Item -ItemType Directory -Force (Split-Path $dst) | Out-Null

$word = New-Object -ComObject Word.Application
try {
    $word.Visible = $false
    $word.DisplayAlerts = 0
    $doc = $word.Documents.Open($src, $false, $true)   # ConfirmConversions=false, ReadOnly=true
    try {
        $doc.ExportAsFixedFormat($dst, 17)              # 17 = wdExportFormatPDF
    } finally {
        $doc.Close([ref]0)                               # 0 = wdDoNotSaveChanges
    }
} finally {
    $word.Quit()
    [void][System.Runtime.InteropServices.Marshal]::ReleaseComObject($word)
}
Write-Output "Wrote $dst ($((Get-Item $dst).Length) bytes)"

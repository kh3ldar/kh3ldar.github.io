import { makeStyles, Text, tokens } from '@fluentui/react-components'
import type { EntityRecord } from '../../data/types'
import { FormSectionCard } from './FormSectionCard'

const useStyles = makeStyles({
  list: { display: 'flex', flexDirection: 'column', rowGap: tokens.spacingVerticalXXL },
  figure: { margin: 0, display: 'flex', flexDirection: 'column', rowGap: tokens.spacingVerticalS, maxWidth: '1100px' },
  video: {
    width: '100%',
    height: 'auto',
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground3,
  },
  caption: { color: tokens.colorNeutralForeground2 },
  empty: { color: tokens.colorNeutralForeground3 },
})

/** Demo videos and images. Videos load metadata only until played. */
export function MediaSection({ label, record, emptyText }: { label: string; record: EntityRecord; emptyText?: string }) {
  const styles = useStyles()
  const media = record.media ?? []
  return (
    <FormSectionCard label={label}>
      {media.length === 0 ? (
        <Text className={styles.empty}>{emptyText}</Text>
      ) : (
        <div className={styles.list}>
          {media.map((item) => (
            <figure key={item.src} className={styles.figure}>
              {item.kind === 'video' ? (
                // #t=0.1 makes browsers paint a first frame without a poster image.
                <video
                  className={styles.video}
                  src={`${item.src}#t=0.1`}
                  poster={item.poster}
                  controls
                  preload="metadata"
                  playsInline
                  aria-label={item.caption}
                />
              ) : (
                <img className={styles.video} src={item.src} alt={item.caption} loading="lazy" />
              )}
              <Text as="p" className={styles.caption}>
                {item.caption}
              </Text>
            </figure>
          ))}
        </div>
      )}
    </FormSectionCard>
  )
}

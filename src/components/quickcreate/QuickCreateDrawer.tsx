import {
  Button,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerHeaderTitle,
  Field,
  Input,
  makeStyles,
  OverlayDrawer,
  Textarea,
  tokens,
} from '@fluentui/react-components'
import { Dismiss24Regular } from '@fluentui/react-icons'
import { useRef, useState, type FormEvent } from 'react'
import type { EntityMetadata, FormDefinition, FormField } from '../../data/types'
import { registry } from '../../platform/metadata'
import { ui, useUi } from '../../platform/state/uiStore'
import { ContactCard } from './ContactCard'

const useStyles = makeStyles({
  form: { display: 'flex', flexDirection: 'column', rowGap: tokens.spacingVerticalL, paddingBottom: tokens.spacingVerticalL },
  footer: { display: 'flex', gap: tokens.spacingHorizontalS },
})

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function formFields(form: FormDefinition): FormField[] {
  return form.tabs.flatMap((t) => t.columns.flatMap((c) => c.sections.flatMap((s) => (s.kind === 'fields' ? s.fields : []))))
}

function QuickCreateBody({ entity, form }: { entity: EntityMetadata; form: FormDefinition }) {
  const styles = useStyles()
  const { messages } = registry.bundle.app
  const fields = formFields(form)
  const [values, setValues] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const validate = () => {
    const next: Record<string, string> = {}
    for (const field of fields) {
      const attribute = registry.getAttribute(entity.logicalName, field.attribute)
      const value = (values[field.attribute] ?? '').trim()
      if (field.required && !value) next[field.attribute] = messages.requiredField
      else if (value && attribute?.format === 'email' && !EMAIL.test(value)) next[field.attribute] = messages.invalidEmail
    }
    return next
  }

  const save = (event: FormEvent) => {
    event.preventDefault()
    const found = validate()
    setErrors(found)
    const first = Object.keys(found)[0]
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }
    // The contact card says what happened; a toast would only cover it.
    setSaved(true)
  }

  return (
    <>
      <DrawerHeader>
        <DrawerHeaderTitle
          action={<Button appearance="subtle" aria-label="Close" icon={<Dismiss24Regular />} onClick={() => ui.closeQuickCreate()} />}
        >
          Quick Create: {entity.displayName}
        </DrawerHeaderTitle>
      </DrawerHeader>
      <DrawerBody>
        {saved ? (
          <ContactCard values={values} />
        ) : (
          <form id="quick-create-form" ref={formRef} className={styles.form} onSubmit={save} noValidate>
            {fields.map((field) => {
              const attribute = registry.getAttribute(entity.logicalName, field.attribute)
              if (!attribute) return null
              const common = {
                name: field.attribute,
                value: values[field.attribute] ?? '',
                placeholder: field.placeholder,
                onChange: (_: unknown, data: { value: string }) => setValues((v) => ({ ...v, [field.attribute]: data.value })),
              }
              return (
                <Field
                  key={field.attribute}
                  label={field.label ?? attribute.displayName}
                  required={field.required}
                  validationMessage={errors[field.attribute]}
                  validationState={errors[field.attribute] ? 'error' : 'none'}
                >
                  {attribute.type === 'memo' ? (
                    <Textarea {...common} resize="vertical" rows={5} />
                  ) : (
                    <Input {...common} type={attribute.format === 'email' ? 'email' : 'text'} autoComplete={attribute.format === 'email' ? 'email' : 'off'} />
                  )}
                </Field>
              )
            })}
          </form>
        )}
      </DrawerBody>
      <DrawerFooter className={styles.footer}>
        {saved ? (
          <Button appearance="primary" onClick={() => ui.closeQuickCreate()}>
            Close
          </Button>
        ) : (
          <>
            <Button appearance="primary" type="submit" form="quick-create-form">
              Save
            </Button>
            <Button onClick={() => ui.closeQuickCreate()}>Cancel</Button>
          </>
        )}
      </DrawerFooter>
    </>
  )
}

/** The quick create panel. The last entity stays rendered while the drawer animates closed. */
export function QuickCreateDrawer() {
  const request = useUi((s) => s.quickCreate)
  // Keep the last request while the drawer animates closed. Derived during render, not in an effect:
  // the content must exist on the first open render so the dialog can move focus into it.
  const [shown, setShown] = useState(request)
  if (request && request !== shown) setShown(request)

  const entity = shown ? registry.getEntity(shown.etn) : undefined
  const form = shown ? registry.getQuickCreateForm(shown.etn) : undefined

  return (
    <OverlayDrawer
      position="end"
      size="medium"
      open={request !== null}
      onOpenChange={(_, data) => {
        if (!data.open) ui.closeQuickCreate()
      }}
      aria-label={entity ? `Quick Create: ${entity.displayName}` : 'Quick Create'}
    >
      {entity && form && <QuickCreateBody key={shown?.session} entity={entity} form={form} />}
    </OverlayDrawer>
  )
}

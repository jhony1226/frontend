# Documentación del componente Accordion

Resumen

- Componente: `AccordionsComponent`
- Plantilla: `accordions.component.html`
- Lógica/TS: `accordions.component.ts`

Descripción
Este conjunto de archivos contiene ejemplos de acordeones usando los componentes/directivas de CoreUI (`c-accordion`, `c-accordion-item`, `cAccordionButton`, `TemplateIdDirective`, etc.). Está pensado como patrón de demostración (docs/examples) para la UI.

Puntos importantes detectados

- Sintaxis no estándar en plantilla: la plantilla usa `@for(item of items; track item; let i = $index;) { ... }`, que NO es la sintaxis de Angular. Si el proyecto no cuenta con un preprocesador que transforme esa sintaxis, la compilación fallará. Recomendamos usar `*ngFor` en su lugar.
- Uso de `bypassSecurityTrustHtml`: La función `getAccordionBodyText()` retorna HTML y lo marca como seguro con `DomSanitizer.bypassSecurityTrustHtml`. Esto está bien si el contenido es controlado (hardcoded). No debes usarlo con contenido no confiable sin sanitización adicional.

Recomendaciones y ejemplos

1. Reemplazo de `@for` por `*ngFor` (si no hay preprocesador):

```html
<c-accordion alwaysOpen class="shadow accordion-custom rounded-2">
  <c-accordion-item *ngFor="let item of items; let i = index; trackBy: trackByIndex" [visible]="i === 1">
    <ng-template cTemplateId="accordionHeader"> Custom Accordion item #{{ i }} </ng-template>
    <ng-template cTemplateId="accordionBody">
      <small><i>{{ i }}.</i></small>
      <span [innerHTML]="getAccordionBodyText(i)"></span>
    </ng-template>
  </c-accordion-item>
</c-accordion>
```

2. Añadir función `trackBy` en el componente TS para mejores rendimientos (opcional):

```ts
trackByIndex(index: number): number {
  return index;
}
```

3. Comentario de seguridad para HTML inyectado (ya añadido en `accordions.component.ts`). Evita usar `bypassSecurityTrustHtml` con datos externos sin sanitización.

Comandos para validar (PowerShell)

```powershell
# instalar dependencias (si hace falta)
npm install

# ejecutar linter (ajusta según script en package.json)
npm run lint

# compilar para verificar errores de template
npm run build
```

Siguientes pasos sugeridos

- ¿Deseas que aplique el cambio `@for` → `*ngFor` en la plantilla y añada `trackBy` en el `.ts`? (Puedo hacerlo y ejecutar `npm run build` para validar).
- Ejecutar herramientas de accesibilidad (`lighthouse`, `axe`) para revisar `aria-*` en los botones si necesitas asegurar la accesibilidad.

Contacto

- Yo puedo aplicar los cambios que autorices y correr build/lint aquí si me das permiso para ejecutar comandos en el entorno.

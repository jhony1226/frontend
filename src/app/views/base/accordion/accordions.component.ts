import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {
  AccordionButtonDirective,
  AccordionComponent,
  AccordionItemComponent,
  BgColorDirective,
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColComponent,
  RowComponent,
  TemplateIdDirective,
} from '@coreui/angular';
import {
  DocsComponentsComponent,
  DocsExampleComponent,
} from '@docs-components/public-api';

@Component({
  selector: 'app-accordions',
  templateUrl: './accordions.component.html',
  styleUrls: ['./accordions.component.scss'],
  imports: [
    RowComponent,
    ColComponent,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    DocsExampleComponent,
    AccordionComponent,
    AccordionItemComponent,
    TemplateIdDirective,
    AccordionButtonDirective,
    BgColorDirective,
    DocsComponentsComponent,
  ],
})
export class AccordionsComponent {
  private sanitizer = inject(DomSanitizer);

  items = [1, 2, 3, 4];

  // Optional: improve ngFor rendering performance by providing a trackBy function
  trackByIndex(_index: number, _item: unknown): number {
    return _index;
  }

  /**
   * getAccordionBodyText
   *
   * Dev note:
   * This method returns HTML that is injected into the template via `[innerHTML]`.
   * The returned value is marked safe with `DomSanitizer.bypassSecurityTrustHtml` because
   * the content originates from a hard-coded template inside the application.
   *
   * Important security note: avoid passing untrusted/external input into this method
   * without proper sanitization to prevent XSS vulnerabilities.
   */
  getAccordionBodyText(value: string | number) {
    const textSample = `
      <strong>This is the <mark>#${value}</mark> item accordion body.</strong> It is hidden by
      default, until the collapse plugin adds the appropriate classes that we use to
      style each element. These classes control the overall appearance, as well as
      the showing and hiding via CSS transitions. You can modify any of this with
      custom CSS or overriding our default variables. It&#39;s also worth noting
      that just about any HTML can go within the <code>.accordion-body</code>,
      though the transition does limit overflow.
    `;
    return this.sanitizer.bypassSecurityTrustHtml(textSample);
  }
}

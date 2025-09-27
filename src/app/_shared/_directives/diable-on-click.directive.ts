import { Directive, HostListener, ElementRef, Renderer2, Input } from '@angular/core';

@Directive({
  selector: '[appDisableOnClick]'
})
export class DisableOnClickDirective {
  @Input('appDisableOnClick') resetAfter: number | null = null; 
  // optional: auto-enable after X ms (if needed)

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('click')
  onClick() {
    // Disable the element
    this.renderer.setProperty(this.el.nativeElement, 'disabled', true);

    // If resetAfter is provided, re-enable after that time
    if (this.resetAfter) {
      setTimeout(() => {
        this.renderer.setProperty(this.el.nativeElement, 'disabled', false);
      }, this.resetAfter);
    }
  }
}

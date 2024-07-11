import { Injectable } from '@angular/core';
import { Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StyleService {
  private renderer: Renderer2;

  constructor(private rendererFactory: RendererFactory2) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  setBodyStyle(style: string, value: string) {
    this.renderer.setStyle(document.body, style, value);
  }
}

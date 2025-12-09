import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true,
})
export class TruncatePipe implements PipeTransform {

  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, ''); // loại bỏ toàn bộ tag HTML
  }

  transform(value: string, limit = 100, trail = '...'): string {
    if (!value) return '';

    const plainText = this.stripHtml(value); // lấy text thuần

    return plainText.length > limit
      ? plainText.substring(0, limit) + trail
      : plainText;
  }
}
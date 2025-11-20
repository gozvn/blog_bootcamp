import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  /**
   * Hiển thị toast Bootstrap theo ID
   * (chỉ chạy khi ở trình duyệt, tránh lỗi SSR)
   */
  async showToast(id: string): Promise<void> {
    if (typeof document === 'undefined') return;

    const toastEl = document.getElementById(id);
    if (!toastEl) {
      console.warn(`Không tìm thấy toast element với id="${id}"`);
      return;
    }

    try {
      const { Toast } = await import('bootstrap');
      const toast = new Toast(toastEl);
      toast.show();
    } catch (err) {
      console.error('Lỗi khi hiển thị toast:', err);
    }
  }

  /**
   * Cập nhật nội dung và hiển thị toast
   */
  async showMessage(id: string, message: string): Promise<void> {
    // showMessage(successToast, 'Operation completed successfully.');
    // showMessage(errorToast, 'An error occurred.'); 
    if (typeof document === 'undefined') return;

    const toastEl = document.getElementById(id);
    if (!toastEl) return;

    const msgEl = toastEl.querySelector('.toast-body');
    if (msgEl) msgEl.textContent = message;

    await this.showToast(id);
  }
}
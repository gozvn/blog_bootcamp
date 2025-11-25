import { Injectable } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../layouts/default/partials/modal/modal.component';

@Injectable({
  providedIn: 'root',
})
export class ModalService {

  constructor(private modal: NgbModal) { }

  confirm(options: {
    title: string;
    message: string;
    icon?: string;
    confirmText?: string;
    cancelText?: string;
    status?: 'danger' | 'success' | 'warning' | 'info';
  }): Promise<boolean> {
    const modalRef = this.modal.open(ModalComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
    } as NgbModalOptions);

    modalRef.componentInstance.data = options;

    return modalRef.result;
  }

}
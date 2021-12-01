import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[sidebarCollapse]'
})
export class SidebarCollapseDirective {

  constructor(
    private el: ElementRef,
  ) {
    $(document).on('click', '.btn-sidebar-collapse', function (e) {
      $(el.nativeElement).css({ 'width': '0' });
      $('.main-content').css('margin-left', '0');

      setTimeout(() => {
        $('.btn-sidebar-show').attr('style', 'display: inline-block !important');
      }, 400);
    });

    $(document).on('click', '.btn-sidebar-show', function (e) {
      $(this).hide();
      $(el.nativeElement).css({ 'width': '250px' });
      $('.main-content').css('margin-left', '250px');
    });
  }

}

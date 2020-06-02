"use strict";

/*
 * Copyright (C) MIKO LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nikolay Beketov, 12 2019
 *
 */

/* global globalRootUrl, PbxApi, globalTranslate, UserMessage, extensionModules */

/**
 * Мониторинг статуса обновления или установки модуля
 *
 */
var upgradeStatusLoopWorker = {
  timeOut: 1000,
  timeOutHandle: '',
  moduleUniqid: '',
  iterations: 0,
  oldPercent: 0,
  needEnableAfterInstall: false,
  initialize: function () {
    function initialize(uniqid, needEnable) {
      upgradeStatusLoopWorker.moduleUniqid = uniqid;
      upgradeStatusLoopWorker.iterations = 0;
      upgradeStatusLoopWorker.needEnableAfterInstall = needEnable;
      upgradeStatusLoopWorker.restartWorker();
    }

    return initialize;
  }(),
  restartWorker: function () {
    function restartWorker() {
      window.clearTimeout(upgradeStatusLoopWorker.timeoutHandle);
      upgradeStatusLoopWorker.worker();
    }

    return restartWorker;
  }(),
  worker: function () {
    function worker() {
      window.clearTimeout(upgradeStatusLoopWorker.timeoutHandle);
      PbxApi.SystemGetModuleInstallStatus(upgradeStatusLoopWorker.moduleUniqid, upgradeStatusLoopWorker.cbRefreshModuleStatus, upgradeStatusLoopWorker.restartWorker);
    }

    return worker;
  }(),
  cbRefreshModuleStatus: function () {
    function cbRefreshModuleStatus(response) {
      upgradeStatusLoopWorker.iterations += 1;
      upgradeStatusLoopWorker.timeoutHandle = window.setTimeout(upgradeStatusLoopWorker.worker, upgradeStatusLoopWorker.timeOut); // Check installation status

      if (response !== false && response.i_status === true) {
        $('a.button').removeClass('disabled');

        if (upgradeStatusLoopWorker.needEnableAfterInstall) {
          PbxApi.SystemEnableModule(upgradeStatusLoopWorker.moduleUniqid, function () {
            extensionModules.reloadModuleAndPage(upgradeStatusLoopWorker.moduleUniqid);
          });
        } else {
          window.location = "".concat(globalRootUrl, "pbx-extension-modules/index/");
        } // window.clearTimeout(upgradeStatusLoopWorker.timeoutHandle);

      } // Check download status


      if (response === false && upgradeStatusLoopWorker.iterations < 50) {
        window.clearTimeout(upgradeStatusLoopWorker.timeoutHandle);
      } else if (upgradeStatusLoopWorker.iterations > 50 || response.d_status === 'DOWNLOAD_ERROR' || response.d_status === 'NOT_FOUND') {
        window.clearTimeout(upgradeStatusLoopWorker.timeoutHandle);
        var errorMessage = response.d_error !== undefined ? response.d_error : '';
        errorMessage = errorMessage.replace(/\n/g, '<br>');
        UserMessage.showError(errorMessage, globalTranslate.ext_UpdateModuleError);
        $("#".concat(upgradeStatusLoopWorker.moduleUniqid)).find('i').removeClass('loading');
        $('.new-module-row').find('i').addClass('download').removeClass('redo');
        $('a.button').removeClass('disabled');
      } else if (response.d_status === 'DOWNLOAD_IN_PROGRESS' || response.d_status === 'DOWNLOAD_COMPLETE') {
        if (upgradeStatusLoopWorker.oldPercent !== response.d_status_progress) {
          upgradeStatusLoopWorker.iterations = 0;
        }

        $('i.loading.redo').closest('a').find('.percent').text("".concat(response.d_status_progress, "%"));
        upgradeStatusLoopWorker.oldPercent = response.d_status_progress;
      }
    }

    return cbRefreshModuleStatus;
  }()
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9QYnhFeHRlbnNpb25Nb2R1bGVzL3BieC1leHRlbnNpb24tbW9kdWxlLXVwZ3JhZGUtc3RhdHVzLXdvcmtlci5qcyJdLCJuYW1lcyI6WyJ1cGdyYWRlU3RhdHVzTG9vcFdvcmtlciIsInRpbWVPdXQiLCJ0aW1lT3V0SGFuZGxlIiwibW9kdWxlVW5pcWlkIiwiaXRlcmF0aW9ucyIsIm9sZFBlcmNlbnQiLCJuZWVkRW5hYmxlQWZ0ZXJJbnN0YWxsIiwiaW5pdGlhbGl6ZSIsInVuaXFpZCIsIm5lZWRFbmFibGUiLCJyZXN0YXJ0V29ya2VyIiwid2luZG93IiwiY2xlYXJUaW1lb3V0IiwidGltZW91dEhhbmRsZSIsIndvcmtlciIsIlBieEFwaSIsIlN5c3RlbUdldE1vZHVsZUluc3RhbGxTdGF0dXMiLCJjYlJlZnJlc2hNb2R1bGVTdGF0dXMiLCJyZXNwb25zZSIsInNldFRpbWVvdXQiLCJpX3N0YXR1cyIsIiQiLCJyZW1vdmVDbGFzcyIsIlN5c3RlbUVuYWJsZU1vZHVsZSIsImV4dGVuc2lvbk1vZHVsZXMiLCJyZWxvYWRNb2R1bGVBbmRQYWdlIiwibG9jYXRpb24iLCJnbG9iYWxSb290VXJsIiwiZF9zdGF0dXMiLCJlcnJvck1lc3NhZ2UiLCJkX2Vycm9yIiwidW5kZWZpbmVkIiwicmVwbGFjZSIsIlVzZXJNZXNzYWdlIiwic2hvd0Vycm9yIiwiZ2xvYmFsVHJhbnNsYXRlIiwiZXh0X1VwZGF0ZU1vZHVsZUVycm9yIiwiZmluZCIsImFkZENsYXNzIiwiZF9zdGF0dXNfcHJvZ3Jlc3MiLCJjbG9zZXN0IiwidGV4dCJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7QUFRQTs7QUFFQTs7OztBQUlBLElBQU1BLHVCQUF1QixHQUFHO0FBQy9CQyxFQUFBQSxPQUFPLEVBQUUsSUFEc0I7QUFFL0JDLEVBQUFBLGFBQWEsRUFBRSxFQUZnQjtBQUcvQkMsRUFBQUEsWUFBWSxFQUFFLEVBSGlCO0FBSS9CQyxFQUFBQSxVQUFVLEVBQUUsQ0FKbUI7QUFL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LHVCQUF1QixDQUFDRyxZQUE3QixFQUFELENBQThDa0MsSUFBOUMsQ0FBbUQsR0FBbkQsRUFBd0RmLFdBQXhELENBQW9FLFNBQXBFO0FBQ0FELFFBQUFBLENBQUMsQ0FBQyxpQkFBRCxDQUFELENBQXFCZ0IsSUFBckIsQ0FBMEIsR0FBMUIsRUFBK0JDLFFBQS9CLENBQXdDLFVBQXhDLEVBQW9EaEIsV0FBcEQsQ0FBZ0UsTUFBaEU7QUFDQUQsUUFBQUEsQ0FBQyxDQUFDLFVBQUQsQ0FBRCxDQUFjQyxXQUFkLENBQTBCLFVBQTFCO0FBQ0EsT0FYTSxNQVdBLElBQUlKLFFBQVEsQ0FBQ1UsUUFBVCxLQUFzQixzQkFBdEIsSUFDUFYsUUFBUSxDQUFDVSxRQUFULEtBQXNCLG1CQURuQixFQUN3QztBQUM5QyxZQUFJNUIsdUJBQXVCLENBQUNLLFVBQXhCLEtBQXVDYSxRQUFRLENBQUNxQixpQkFBcEQsRUFBdUU7QUFDdEV2QyxVQUFBQSx1QkFBdUIsQ0FBQ0ksVUFBeEIsR0FBcUMsQ0FBckM7QUFDQTs7QUFDRGlCLFFBQUFBLENBQUMsQ0FBQyxnQkFBRCxDQUFELENBQW9CbUIsT0FBcEIsQ0FBNEIsR0FBNUIsRUFBaUNILElBQWpDLENBQXNDLFVBQXRDLEVBQWtESSxJQUFsRCxXQUEwRHZCLFFBQVEsQ0FBQ3FCLGlCQUFuRTtBQUNBdkMsUUFBQUEsdUJBQXVCLENBQUNLLFVBQXhCLEdBQXFDYSxRQUFRLENBQUNxQixpQkFBOUM7QUFDQTtBQUNEOztBQWxFOEI7QUFBQTtBQUFBLENBQWhDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoQykgTUlLTyBMTEMgLSBBbGwgUmlnaHRzIFJlc2VydmVkXG4gKiBVbmF1dGhvcml6ZWQgY29weWluZyBvZiB0aGlzIGZpbGUsIHZpYSBhbnkgbWVkaXVtIGlzIHN0cmljdGx5IHByb2hpYml0ZWRcbiAqIFByb3ByaWV0YXJ5IGFuZCBjb25maWRlbnRpYWxcbiAqIFdyaXR0ZW4gYnkgTmlrb2xheSBCZWtldG92LCAxMiAyMDE5XG4gKlxuICovXG5cbi8qIGdsb2JhbCBnbG9iYWxSb290VXJsLCBQYnhBcGksIGdsb2JhbFRyYW5zbGF0ZSwgVXNlck1lc3NhZ2UsIGV4dGVuc2lvbk1vZHVsZXMgKi9cblxuLyoqXG4gKiDQnNC+0L3QuNGC0L7RgNC40L3QsyDRgdGC0LDRgtGD0YHQsCDQvtCx0L3QvtCy0LvQtdC90LjRjyDQuNC70Lgg0YPRgdGC0LDQvdC+0LLQutC4INC80L7QtNGD0LvRj1xuICpcbiAqL1xuY29uc3QgdXBncmFkZVN0YXR1c0xvb3BXb3JrZXIgPSB7XG5cdHRpbWVPdXQ6IDEwMDAsXG5cdHRpbWVPdXRIYW5kbGU6ICcnLFxuXHRtb2R1bGVVbmlxaWQ6ICcnLFxuXHRpdGVyYXRpb25zOiAwLFxuXHRvbGRQZXJjZW50OiAwLFxuXHRuZWVkRW5hYmxlQWZ0ZXJJbnN0YWxsOiBmYWxzZSxcblx0aW5pdGlhbGl6ZSh1bmlxaWQsIG5lZWRFbmFibGUpIHtcblx0XHR1cGdyYWRlU3RhdHVzTG9vcFdvcmtlci5tb2R1bGVVbmlxaWQgPSB1bmlxaWQ7XG5cdFx0dXBncmFkZVN0YXR1c0xvb3BXb3JrZXIuaXRlcmF0aW9ucyA9IDA7XG5cdFx0dXBncmFkZVN0YXR1c0xvb3BXb3JrZXIubmVlZEVuYWJsZUFmdGVySW5zdGFsbCA9IG5lZWRFbmFibGU7XG5cdFx0dXBncmFkZVN0YXR1c0xvb3BXb3JrZXIucmVzdGFydFdvcmtlcigpO1xuXHR9LFxuXHRyZXN0YXJ0V29ya2VyKCkge1xuXHRcdHdpbmRvdy5jbGVhclRpbWVvdXQodXBncmFkZVN0YXR1c0xvb3BXb3JrZXIudGltZW91dEhhbmRsZSk7XG5cdFx0dXBncmFkZVN0YXR1c0xvb3BXb3JrZXIud29ya2VyKCk7XG5cdH0sXG5cdHdvcmtlcigpIHtcblx0XHR3aW5kb3cuY2xlYXJUaW1lb3V0KHVwZ3JhZGVTdGF0dXNMb29wV29ya2VyLnRpbWVvdXRIYW5kbGUpO1xuXHRcdFBieEFwaS5TeXN0ZW1HZXRNb2R1bGVJbnN0YWxsU3RhdHVzKFxuXHRcdFx0dXBncmFkZVN0YXR1c0xvb3BXb3JrZXIubW9kdWxlVW5pcWlkLFxuXHRcdFx0dXBncmFkZVN0YXR1c0xvb3BXb3JrZXIuY2JSZWZyZXNoTW9kdWxlU3RhdHVzLFxuXHRcdFx0dXBncmFkZVN0YXR1c0xvb3BXb3JrZXIucmVzdGFydFdvcmtlcixcblx0XHQpO1xuXHR9LFxuXHRjYlJlZnJlc2hNb2R1bGVTdGF0dXMocmVzcG9uc2UpIHtcblx0XHR1cGdyYWRlU3RhdHVzTG9vcFdvcmtlci5pdGVyYXRpb25zICs9IDE7XG5cdFx0dXBncmFkZVN0YXR1c0xvb3BXb3JrZXIudGltZW91dEhhbmRsZSA9XG5cdFx0XHR3aW5kb3cuc2V0VGltZW91dCh1cGdyYWRlU3RhdHVzTG9vcFdvcmtlci53b3JrZXIsIHVwZ3JhZGVTdGF0dXNMb29wV29ya2VyLnRpbWVPdXQpO1xuXHRcdC8vIENoZWNrIGluc3RhbGxhdGlvbiBzdGF0dXNcblx0XHRpZiAocmVzcG9uc2UgIT09IGZhbHNlICYmIHJlc3BvbnNlLmlfc3RhdHVzID09PSB0cnVlKSB7XG5cdFx0XHQkKCdhLmJ1dHRvbicpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xuXHRcdFx0aWYgKHVwZ3JhZGVTdGF0dXNMb29wV29ya2VyLm5lZWRFbmFibGVBZnRlckluc3RhbGwpIHtcblx0XHRcdFx0UGJ4QXBpLlN5c3RlbUVuYWJsZU1vZHVsZShcblx0XHRcdFx0XHR1cGdyYWRlU3RhdHVzTG9vcFdvcmtlci5tb2R1bGVVbmlxaWQsXG5cdFx0XHRcdFx0KCkgPT4geyBleHRlbnNpb25Nb2R1bGVzLnJlbG9hZE1vZHVsZUFuZFBhZ2UodXBncmFkZVN0YXR1c0xvb3BXb3JrZXIubW9kdWxlVW5pcWlkKTsgfSxcblx0XHRcdFx0KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHdpbmRvdy5sb2NhdGlvbiA9IGAke2dsb2JhbFJvb3RVcmx9cGJ4LWV4dGVuc2lvbi1tb2R1bGVzL2luZGV4L2A7XG5cdFx0XHR9XG5cdFx0XHQvLyB3aW5kb3cuY2xlYXJUaW1lb3V0KHVwZ3JhZGVTdGF0dXNMb29wV29ya2VyLnRpbWVvdXRIYW5kbGUpO1xuXHRcdH1cblxuXHRcdC8vIENoZWNrIGRvd25sb2FkIHN0YXR1c1xuXHRcdGlmIChyZXNwb25zZSA9PT0gZmFsc2Vcblx0XHRcdCYmIHVwZ3JhZGVTdGF0dXNMb29wV29ya2VyLml0ZXJhdGlvbnMgPCA1MCkge1xuXHRcdFx0d2luZG93LmNsZWFyVGltZW91dCh1cGdyYWRlU3RhdHVzTG9vcFdvcmtlci50aW1lb3V0SGFuZGxlKTtcblx0XHR9IGVsc2UgaWYgKHVwZ3JhZGVTdGF0dXNMb29wV29ya2VyLml0ZXJhdGlvbnMgPiA1MFxuXHRcdFx0fHwgcmVzcG9uc2UuZF9zdGF0dXMgPT09ICdET1dOTE9BRF9FUlJPUidcblx0XHRcdHx8IHJlc3BvbnNlLmRfc3RhdHVzID09PSAnTk9UX0ZPVU5EJ1xuXHRcdCkge1xuXHRcdFx0d2luZG93LmNsZWFyVGltZW91dCh1cGdyYWRlU3RhdHVzTG9vcFdvcmtlci50aW1lb3V0SGFuZGxlKTtcblx0XHRcdGxldCBlcnJvck1lc3NhZ2UgPSAocmVzcG9uc2UuZF9lcnJvciAhPT0gdW5kZWZpbmVkKSA/IHJlc3BvbnNlLmRfZXJyb3IgOiAnJztcblx0XHRcdGVycm9yTWVzc2FnZSA9IGVycm9yTWVzc2FnZS5yZXBsYWNlKC9cXG4vZywgJzxicj4nKTtcblx0XHRcdFVzZXJNZXNzYWdlLnNob3dFcnJvcihlcnJvck1lc3NhZ2UsIGdsb2JhbFRyYW5zbGF0ZS5leHRfVXBkYXRlTW9kdWxlRXJyb3IpO1xuXHRcdFx0JChgIyR7dXBncmFkZVN0YXR1c0xvb3BXb3JrZXIubW9kdWxlVW5pcWlkfWApLmZpbmQoJ2knKS5yZW1vdmVDbGFzcygnbG9hZGluZycpO1xuXHRcdFx0JCgnLm5ldy1tb2R1bGUtcm93JykuZmluZCgnaScpLmFkZENsYXNzKCdkb3dubG9hZCcpLnJlbW92ZUNsYXNzKCdyZWRvJyk7XG5cdFx0XHQkKCdhLmJ1dHRvbicpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xuXHRcdH0gZWxzZSBpZiAocmVzcG9uc2UuZF9zdGF0dXMgPT09ICdET1dOTE9BRF9JTl9QUk9HUkVTUydcblx0XHRcdHx8IHJlc3BvbnNlLmRfc3RhdHVzID09PSAnRE9XTkxPQURfQ09NUExFVEUnKSB7XG5cdFx0XHRpZiAodXBncmFkZVN0YXR1c0xvb3BXb3JrZXIub2xkUGVyY2VudCAhPT0gcmVzcG9uc2UuZF9zdGF0dXNfcHJvZ3Jlc3MpIHtcblx0XHRcdFx0dXBncmFkZVN0YXR1c0xvb3BXb3JrZXIuaXRlcmF0aW9ucyA9IDA7XG5cdFx0XHR9XG5cdFx0XHQkKCdpLmxvYWRpbmcucmVkbycpLmNsb3Nlc3QoJ2EnKS5maW5kKCcucGVyY2VudCcpLnRleHQoYCR7cmVzcG9uc2UuZF9zdGF0dXNfcHJvZ3Jlc3N9JWApO1xuXHRcdFx0dXBncmFkZVN0YXR1c0xvb3BXb3JrZXIub2xkUGVyY2VudCA9IHJlc3BvbnNlLmRfc3RhdHVzX3Byb2dyZXNzO1xuXHRcdH1cblx0fSxcbn07XG4iXX0=
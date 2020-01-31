import './content.css';

chrome.runtime.onMessage.addListener(async function(msg, sender, response) {
  if (msg.trigger) {
    var origin = window.origin;
    var href = window.location.href;
    var arrHref = href.split('/');
    var linkGroupMembers = origin + `/groups/${arrHref[4]}/members/`;
    window.location.replace(linkGroupMembers);
  }
  response(msg);
});

$(document).ready(async function() {
  var origin = window.origin;
  var href = window.location.href;
  var arrHref = href.split('/');
  var linkGroupMembers = origin + `/groups/${arrHref[4]}/members/`;
  if (window.location.href === linkGroupMembers) {
    chrome.runtime.sendMessage(
      {
        msg: 'getStatusTrigger'
      },
      function(response) {
        if (response.data) {
          $('body').append(`<div class="load-9" id="loading-09">
          <div class="spinner">
            <div class="bubble-1"></div>
            <div class="bubble-2"></div>
          </div>
        </div>`);
          var totalHeight = 0;
          var distance = 1000;
          var timer = setInterval(() => {
            var scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;
            if (totalHeight >= scrollHeight) {
              if ($('span.uiMorePagerLoader.pam.uiBoxLightblue').length === 0) {
                clearInterval(timer);
                var listItem = $('a._60rg._8o._8r.lfloat._ohe');
                var arrayProfile = [];
                for (var i = 0; i < listItem.length; i++) {
                  var arrHref = listItem[i].href.split('?');
                  var link = arrHref[0].includes('profile.php')
                    ? arrHref[0] + '?' + arrHref[1].split('&')[0]
                    : arrHref[0];
                  arrayProfile.push({
                    Name: listItem[i].title,
                    Link: link
                  });
                }
                chrome.runtime.sendMessage(
                  {
                    msg: 'arrayProfile',
                    data: arrayProfile
                  },
                  function(res) {
                    $('#loading-09').remove();
                  }
                );
              }
            }
          }, 10);
        }
      }
    );
  }
});

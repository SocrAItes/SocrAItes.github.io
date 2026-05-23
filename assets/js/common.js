// aHR0cHM6Ly9naXRodWIuY29tL2x1b3N0MjYvYWNhZGVtaWMtaG9tZXBhZ2U=
$(function () {
    function fitSingleLineText(element) {
        var parentWidth = element.parentElement.clientWidth;
        if (!parentWidth) {
            return;
        }

        var computedStyle = window.getComputedStyle(element);
        var maxFontSize = parseFloat(element.dataset.maxFontSize || computedStyle.fontSize);
        var minFontSize = parseFloat(element.dataset.minFontSize || 8);
        var low = minFontSize;
        var high = maxFontSize;

        element.style.whiteSpace = "nowrap";

        for (var i = 0; i < 12; i++) {
            var mid = (low + high) / 2;
            element.style.fontSize = mid + "px";
            if (element.scrollWidth <= parentWidth) {
                low = mid;
            } else {
                high = mid;
            }
        }

        element.style.fontSize = low.toFixed(2) + "px";
    }

    function fitSingleLineTexts() {
        document.querySelectorAll(".education-name-long").forEach(fitSingleLineText);
    }

    var fitResizeTimer = null;
    window.addEventListener("resize", function () {
        window.clearTimeout(fitResizeTimer);
        fitResizeTimer = window.setTimeout(fitSingleLineTexts, 100);
    });

    fitSingleLineTexts();
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(fitSingleLineTexts);
    }

    lazyLoadOptions = {
        scrollDirection: 'vertical',
        effect: 'fadeIn',
        effectTime: 300,
        placeholder: "",
        onError: function(element) {
            console.log('[lazyload] Error loading ' + element.data('src'));
        },
        afterLoad: function(element) {
            if (element.is('img')) {
                // remove background-image style
                element.css('background-image', 'none');
                element.css('min-height', '0');
            } else if (element.is('div')) {
                // set the style to background-size: cover; 
                element.css('background-size', 'cover');
                element.css('background-position', 'center');
            }
        }
    }

    $('img.lazy, div.lazy:not(.always-load)').Lazy({visibleOnly: true, ...lazyLoadOptions});
    $('div.lazy.always-load').Lazy({visibleOnly: false, ...lazyLoadOptions});

    $('[data-toggle="tooltip"]').tooltip()

    var $grid = $('.grid').masonry({
        "percentPosition": true,
        "itemSelector": ".grid-item",
        "columnWidth": ".grid-sizer"
    });
    // layout Masonry after each image loads
    $grid.imagesLoaded().progress(function () {
        $grid.masonry('layout');
    });

    $(".lazy").on("load", function () {
        $grid.masonry('layout');
    });
})

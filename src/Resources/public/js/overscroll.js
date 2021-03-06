(function($) {
    Overscroll = {
        init: function() {
            this.initOverscroll();
        },
        jumpToCalled: false,
        iterator: 0,
        initOverscroll: function() {
            var self = this,
                $overscroll = $('#overscroll');

            if ($overscroll.length < 1) {
                return;
            }

            $(window).scroll(function() {
                self.updateOverscroll();
            });
        },
        updateOverscroll: function() {
            var $overscroll = $('#overscroll'),
                $circle = $('.progress-circle'),
                el = $circle.get(0),
                url = $circle.data('url'),
                scroll = $(window).scrollTop(),
                start = $('body').outerHeight() - $overscroll.height() - $(window).height(),
                progress = 0.1; // 50 is the padding

            if (scroll > start) {
                progress = scroll - start;
                if (!$circle.hasClass('show')) {
                    $circle.addClass('show');
                }
            } else {
                $circle.removeClass('show');
            }

            var options = {
                percentage: 100 * progress / $overscroll.height(),
                size: el.getAttribute('data-size') || 220,
                lineWidth: el.getAttribute('data-line') || 7,
                lineColor: el.getAttribute('data-line-color') || '#FFFFFF',
                lineColorFinished: el.getAttribute('data-line-color-finished') || '#555555',
                rotate: el.getAttribute('data-rotate') || 0
            }, canvas;

            // catch browser back initial jumpTo scroll with Overscroll.iterator
            if (Overscroll.iterator > 2 && !Overscroll.jumpToCalled && options.percentage >= 100 && typeof url !== 'undefined') {
                Overscroll.jumpToCalled = true;
                location.href = url;
                $circle.addClass('jumped');
            }

            if (typeof url !== 'undefined') {
                $circle.on('click', function(e) {
                    location.href = url;
                });
            }

            if ($circle.find('canvas').length > 0) {
                canvas = $circle.find('canvas').get(0);
            }
            else {
                canvas = document.createElement('canvas');
                el.appendChild(canvas);
            }

            var a = document.createElement('a');

            a.className = 'caption';
            a.textContent = options.percentage + '%';

            if (typeof(G_vmlCanvasManager) !== 'undefined') {
                G_vmlCanvasManager.initElement(canvas);
            }

            var context = canvas.getContext('2d');

            context.clearRect(0, 0, canvas.width, canvas.height);
            canvas.width = canvas.height = options.size;

            if ($circle.find('.caption').length < 1) {
                el.appendChild(a);
            }

            context.translate(options.size / 2, options.size / 2); // change center
            context.rotate((-1 / 2 + options.rotate / 180) * Math.PI); // rotate -90 deg

            //imd = context.getImageData(0, 0, 240, 240);
            var radius = (options.size - options.lineWidth) / 2;

            var drawCircle = function(color, lineWidth, percentage) {
                percentage = Math.min(Math.max(0, percentage || 1), 1);
                context.beginPath();
                context.arc(0, 0, radius, 0, Math.PI * 2 * percentage, false);
                context.strokeStyle = color;
                context.lineCap = 'square'; // butt, round or square
                context.lineWidth = lineWidth;
                context.stroke();
            };

            Overscroll.iterator++;

            drawCircle(options.lineColor, options.lineWidth, 100 / 100);
            drawCircle(options.lineColorFinished, options.lineWidth, options.percentage / 100);
        }
    };

    $(document).ready(function() {
        Overscroll.init();
    });
})(jQuery);
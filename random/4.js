$.deferred.define();

var color = function() {
    var num = Math.floor(Math.random()*8);
    return ('00' + num.toString(2)).substr(-3,3).split('').map(
        function(i) {return i*255;}
    );
};

var filtergenerator = function() {
    var diffs = [];
    var multis = [];
    for (var i=0; i < 3; i++) {
        multis.push([Math.random(),Math.random()]);
    }
    return function(color) {
        result = [];
        for (var i=0; i < 3; i++) {
            var filtered = Math.floor(((color[i] / 255) * multis[i][0] + (1 - color[i] / 255) * (multis[i][1])) * 255);
            result.push(filtered);
        }
        return result;
    };
};

var fillall = function(element) {
    var canvas = element.getContext('2d');
    var size = element.height;
    canvas.fillStyle = 'rgb('+$(element).data('filter')(color()).join(',')+')';
    canvas.fillRect(0, 0, size, size);
};

var draw = function(element) {
    var canvas = element.getContext('2d');
    var size = element.height;
    var per = parseInt(location.hash.replace(/^#/, '')) || 16;
    var length = size / per;
    var curcolor = color();
    var neibors = function(from) {
        var result = [];
        if (from%per > 0 && from-1 >= 0 ) result.push(from-1);
        if (from-per >= 0 ) result.push(from-per);
        if (from%per < per-1 && from+1 < per*per ) result.push(from+1);
        if (from+per < per*per ) result.push(from+per);
        return result;
    };
    next(function() {
        var data = [];
        for (var i=0; i<per*per; i++) {
            data.push(false);
        };

        var fill = function(data,from, fillsize) {
            data[from] = true;
            next(function() {
                canvas.fillStyle = 'rgb('+$(element).data('filter')(curcolor).join(',')+')';
                canvas.fillRect(Math.floor(from%per)*length, Math.floor(from/per)*length,length,length);
            });
            var around = neibors(from);
            for (var i=0; i< around.length && fillsize > 0; i++) {
                if (!data[around[i]] && Math.random() < around.length/5) {
                    fillsize-=1;
                    fill(data, around[i], fillsize);
                }
            }
        };
        var from = Math.floor(Math.random() * per * per);
        var fillsize = Math.floor(Math.random() * per*2);
        fill(data, from, fillsize);
        return data;
    }).next(function() {
        if ($(element).hasClass("run")) {
            draw(element);
        }
    });
};

$(document).ready(function(){
    $('canvas').each(function(){
        $(this).click(function() {
            $(this).toggleClass("run");
            if ($(this).hasClass("run")) {
                draw(this);
            }
        });
        $(this).data('filter', filtergenerator());
        fillall(this);
        draw(this);
    });
});

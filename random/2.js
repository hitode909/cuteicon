$.deferred.define();

var draw = function(element) {
    var canvas = element.getContext('2d');
    var size = element.height;
    var per = 2;
    for (var i=0; i<8; i++) {
        if (Math.random() > 0.7) per*= 2;
    }
    var length = size / per;

    var from = Math.random();
    var to = Math.random();
    if (from > to) {
        var tmp = to;
        var to = from;
        var from = tmp;
    }

    return next(function() {
        // 0, 1
        var result = [];
        for (var i=0; i<per*per; i++) {
            result.push(Math.floor(Math.random()*1.5));
        };
        return result;
    }).next(function(data) {
        // "rgb(r,g,b)"
        var color = function(num) {
            return ('00' + num.toString(2)).substr(-3,3).split('').map(
                function(i) {return i*255;}
            );
        };
        var colors = [color(Math.floor(Math.random()*8)),color(Math.floor(Math.random()*8))];
        var result = $.map(data, function(pixel) {
            return 'rgb('+colors[pixel].join(',')+')';
        });
        return result;
    }).next(function(data) {
        // fill
        loop({begin:0, end:per*per-1, step:1}, function(i, o) {
                 var cur= i / (per*per-1);
                 if (from < cur && cur < to) {
                     canvas.fillStyle = data[i];
                     canvas.fillRect(Math.floor(i%per)*length, Math.floor(i/per)*length,length,length);
                 }
        });
    });
};

$(document).ready(function(){
    $('canvas').each(function(){
        $(this).click(function() {
            draw(this);
        });
        var self = this;
        loop(100, function(i, o) {
            wait(i).next(function(){
                draw(self);
            });
        });
    });
});

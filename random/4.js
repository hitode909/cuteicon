$.deferred.define();

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
var filter = filtergenerator();

var draw = function(element) {
    var canvas = element.getContext('2d');
    var size = element.height;
    var per = 16;
    var length = size / per;
    var neibors = function(from) {
        var result = [];
        if (from%per > 0 && from-1 >= 0 ) result.push(from-1);
        if (from-per >= 0 ) result.push(from-per);
        if (from%per < per-1 && from+1 < per*per ) result.push(from+1);
        if (from+per < per*per ) result.push(from+per);
        return result;
    };
    var color = function() {
        var num = Math.floor(Math.random()*8);
        return ('00' + num.toString(2)).substr(-3,3).split('').map(
            function(i) {return i*255;}
            );
    };
    return next(function() {
        // 0
        var result = [];
        for (var i=0; i<per*per; i++) {
            result.push(0);
        };
        return result;
    }).next(function(data) {
    // put
        var fill = function(data,from, fillsize) {
            data[from] = 1;
            var around = neibors(from);
            for (var i=0; i< around.length && fillsize > 0; i++) {
                if (data[around[i]] == 0 && Math.random() < around.length/6) {
                    fillsize-=1;
                    fill(data, around[i], fillsize);
                }
            }
        };
        var from = Math.floor(Math.random() * per * per);
        var fillsize = Math.floor(Math.random() * per*2);
        fill(data, from, fillsize);
        return data;
    }).next(function(data) {
        // fill
        canvas.fillStyle = 'rgb('+filter(color()).join(',')+')';
        loop({begin:0, end:per*per-1, step:1}, function(i, o) {
            if (data[i] > 0) {
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
    });
});

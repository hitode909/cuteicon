$.deferred.define();


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
    var color = function(num) {
        if(typeof(num)!= 'number') num = Math.floor(Math.random()*8);
        return ('00' + num.toString(2)).substr(-3,3).split('').map(
            function(i) {return i*255;}
        );
    };
    var filtergenerator = function() {
        var diffs = [];
        var multis = [];
        for (var i=0; i < 3; i++) {
            diffs.push((Math.random()-0.5)*255);
            multis.push(Math.random()*2);
        }
        return function(color) {
            console.log(diffs);
            result = [];
            for (var i=0; i < 3; i++) {
                var filtered = (color[i] + diffs[i]) * multis[i];
                if (filtered < 0) filtered = 0;
                if (filtered > 255) filtered = 255;
                result.push(filtered);
            }
            return result;
        };
    };
    var filter = filtergenerator();

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
        var fillsize = Math.floor(Math.random() * per);
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
        var self = this;
        loop(100, function(i, o) {
            wait(i).next(function(){
                draw(self);
            });
        });
    });
});

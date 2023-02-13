export const throttle = function (fun:Function, delay:number) {
    let timer:any;
    return function () {
        var args = arguments;
        if (!timer) {
            timer = setTimeout(function () {
                fun.apply(this, args);
                timer = null;
            }, delay);
        }
    }
}
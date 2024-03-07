!(function() {
    let start = new Date().getTime();
    let callback = function() {
      let ts = new Date().getTime();
      if (ts - 1000 > start) {
        // console.log('End');
      }
      else {
        console.log(ts);
        requestAnimationFrame(callback);
      }
    }
    requestAnimationFrame(callback);
  })();
export const safeCallback = (callback, arg1, arg2, arg3) => {
  if (typeof callback !== 'function') return;
  if (arg3 !== undefined) {
    callback(arg1, arg2, arg3);
  } else if (arg2 !== undefined) {
    callback(arg1, arg2);
  } else {
    callback(arg1);
  }
}

 

/**
 * Clone Easing (v1.0.1.20161216), http://tpkn.me/
 */

var doc = fl.getDocumentDOM();
var timeline = doc.getTimeline();


/**
 * Round number to  N digits after dot (12.3456789 -> 12.3456)
 * @param  {Number} num
 * @param  {Number} len
 * @return {Number}
 */
function round(num, len){
   len = Math.pow(10, typeof len == 'undefined' ? 4 : len);
   return Math.floor(num * len) / len;
}


/**
 * Convert plane array into string, so SWFPanel.call() did not return error
 * @param  {Array} arr
 * @return {String}
 */
function strigify(arr){
   var i, str = '';
   for(i = 0; i < arr.length; i++){
      str += (i != 0 ? ',' : '') + '{x:' + round(arr[i].x) + ',y:' + round(arr[i].y) + '}';
   }
   return str;
}


/**
 * Convert string back to plane array
 * @param  {String} str
 * @return {Array}
 */
function objectify(str){
   var arr = [], match,
       rule = /(\{x\:(.+?),y\:(.+?)\})/gi;

   while((match = rule.exec(str)) != null){
      arr.push({x:Number(match[2]), y:Number(match[3])});
   }

   return arr;
}


/**
 * Get extension panel
 */
function getPanel(){
   var i, swf_panels = fl.swfPanels;

   if(swf_panels.length > 0){
      for(i = 0; i < swf_panels.length; i++){
         if(swf_panels[i].name == 'Clone Easing'){
            return swf_panels[i];
         }
      }
   }else{
      return 'no_panel';
   }
}


/**
 * Save easing in swf panel
 */
function copyEasing(){
   var layer = timeline.layers[timeline.currentLayer],
       frame = layer.frames[timeline.currentFrame];

   if(frame.hasCustomEase){
      getPanel().call('copyCallback', strigify(frame.getCustomEase('all')));
      getPanel().call('statCallback', 'Layer: ' + layer.name + ' > Frame: ' + frame.startFrame);
   }else{
      getPanel().call('copyCallback', '');
      getPanel().call('statCallback', '');
   }
}


/**
 * Take saved easing and apply it to all selected frames
 */
function pasteEasing(easing){
   var i, layer, frame, recipient_frame, 
       selected_frames = String(timeline.getSelectedFrames()).split(',');

   if(easing.length && selected_frames.length){
      for(i = 0; i < selected_frames.length / 3; i++){
         layer = selected_frames[i * 3];
         frame = selected_frames[i * 3 + 1];

         recipient_frame = timeline.layers[layer].frames[frame];
         recipient_frame.hasCustomEase = true;
         recipient_frame.setCustomEase("all", objectify(easing));
      }
   }
}
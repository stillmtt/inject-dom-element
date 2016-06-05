"use strict";

(function(){

  /**
   * main module
   */
  var injectdom = (function(){

    var doc = document;
    var docFragment = doc.createDocumentFragment();
    var arrOfNodeElms = [];

    var fn_obj = function(type, val){
      
      /**
       * create element
       * @return {nodeElement}
       */
      var createEl = function(){
        var el = doc.createElement(val);
        arrOfNodeElms[arrOfNodeElms.length] = el;
        return el;   
      };

      /**
       * set attribute to last element on[arrOfNodeElms]
       */
      var setAttr = function(){
        var param; 
        var elm = arrOfNodeElms[(arrOfNodeElms.length - 1)];

        if(String(typeof val) === "string"){
          param = val.split(' ');
      
          return elm.setAttribute(param[0], param[1]);
        }
        
        Object.keys(val).map(function(key){
          elm.setAttribute(key, val[key]);
        });

        return this;
        
      };

      var addContent = function(){
        var content = doc.createTextNode(val)
        arrOfNodeElms[(arrOfNodeElms.length - 1)].appendChild(content); 
      };

      /**
       * new object, so call iterate fn to go through it
       */
      var isChildElm = function(){
        iterateObj(val);
      };
      
      var types = {
        'tag': createEl,
        'attr': setAttr,
        'context': addContent,
        'child': isChildElm
      };

      return types[type]();
    };

    /**
     * append each Node element inside each other from right to left
     * @return {object}
     */
    var appendIt = function(){
      var elm = arrOfNodeElms.reduceRight(function(a, b){
        b.appendChild(a);
        return b;
      });

      arrOfNodeElms.length = 0;
      docFragment.appendChild(elm);
      
      return this;
    };

    /**
     * Iterate over object literals 
     * @param  {Object}
     */
    var iterateObj = function(obj){
      return Object.keys(obj).map(function(key){
        return fn_obj(key, obj[key]);
      });
    };

    /**
     * Iterate over an array sorting out object and dom elements
     * @param  {Array}
     */
    var iterateArr = function(arr){
      arr.forEach(function(obj){
              
        iterateObj(obj);

        if(arrOfNodeElms.length > 0){
          console.log(arrOfNodeElms);
            appendIt();
        }        
      
      });

    };



    return function(obj){
      
      iterateArr(obj);
      doc.body.appendChild(docFragment);

      return this;
    };


  }());//end injectdom


var obj_dom = [{
  tag: 'header',
  attr: 'class page_header',
  child: {
    tag: 'h1',
    context: "H1 Title",
    attr: {
      style: 'color: #000'
    }
  }
},{
  tag: 'main',
  attr: {
    class:'four',
    style:'background: #ccc;color: white'
  },
  child: {
    tag: 'article',
    attr: {
      id: 'five',
      name: 'still'
    },
    child: {
      tag: 'p',
      attr: 'class six',
      context: "here some dummy text"
    }
  }
}];


//fired
injectdom(obj_dom);

}());//end iife

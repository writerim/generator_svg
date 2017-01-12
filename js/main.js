//~ res_cen_svg

// Формы
var FormModel = Backbone.Model.extend({
  defaults : {
    ident   : "",
    name    : ""
  },
  idAttribute : 'ident'
})

var FormCollection = Backbone.Collection.extend({
  model : FormModel
})
var Forms = new FormCollection();

Forms.add([
  {ident : "circle"     , name : "Круг"           },
  {ident : "square"     , name : "Квадрат"        },
  {ident : "rectangle"  , name : "Прямоугольник"  },
])



// Цвета
var ColorModel = Backbone.Model.extend({
  defaults : {
    ident   : "",
    name    : ""
  },
  idAttribute : 'ident'
})

var ColorCollection = Backbone.Collection.extend({
  model : ColorModel
})
var Colors = new ColorCollection();

Colors.add([
  {ident : "red"    , name : "Красный"  },
  {ident : "blue"   , name : "Синий"    },
  {ident : "green"  , name : "Зеленый"  },
])




// Элемент рисунка
var SVGElemModel = Backbone.Model.extend({
  defaults : {
    type      : "rectangle", // тип объекта
    stroke_h  : 0, // толщина рамки
    stroke_c  : 0, // цвет рамки
    fill      : 0, // заливка
    width     : 10, // ширина
    height    : 10, // высота
    top       : 0, // отступ сверху
    left      : 0, // отступ слева
  },
  
  getColor : function(){
    return this.fill
  },
  
  getType : function(){
    return Forms.get( this.get('type') )
  },
  getTypeIdent : function(){
    return this.getType() ? this.getType().get('ident') : ''
  },
})

var SVGElemCollect = Backbone.Collection.extend({
  model : SVGElemModel
})
SVGElemCollect = new SVGElemCollect()


// Рисунок
var SVGModel = Backbone.Model.extend({
  defaults : {
    name    : "",
    width   : 32,
    height  : 32
  }
})
var SVG = new SVGModel();


// Форма для заполнения
var FormSVGView = Backbone.View.extend({
  el : '#form_svg',
  template : '#tpl_form_svg',
  model : SVG,
  initialize : function(){
    this.render()
    new SVGResView()
  },
  events : {
    'click #add_svg_elem' : function(){
      new SVGElemView({ model : SVGElemCollect.add({}).last() })
    },
    'keyup #height_svg' : "Event_height_svg"  ,
    'click #height_svg' : "Event_height_svg"  ,
    'keyup #width_svg'  : "Event_width_svg"   ,
    'click #width_svg'  : "Event_width_svg"   ,
    
    'keyup .w_svg'      : "Event_width"       ,
    'click .w_svg'      : "Event_width"       ,
    
    'keyup .h_svg'      : "Event_height"      ,
    'click .h_svg'      : "Event_height"      ,
    
    'keyup .top_svg'    : "Event_top"         ,
    'click .top_svg'    : "Event_top"         ,
    
    'keyup .left_svg'   : "Event_left"        ,
    'click .left_svg'   : "Event_left"        ,
    
    'change .type_svg'  : "Event_type"        ,
    
    'change .fill_svg'  : "Event_fill"        ,
  },
  
  Event_height_svg : function( e ){
    this.model.set('height' , $(e.target).val())
  },
  Event_width_svg : function( e ){
    this.model.set('width' , $(e.target).val())
  },
  
  Event_width : function(e){
    var obj = SVGElemCollect.get( $(e.target).closest('tr').attr('id').replace('width_','') )
    obj.set( 'width' , $(e.target).val() )
  },
  Event_height : function(e){
    var obj = SVGElemCollect.get( $(e.target).closest('tr').attr('id').replace('height_','') )
    obj.set( 'height' , $(e.target).val() )
  },
  Event_top : function(e){
    var obj = SVGElemCollect.get( $(e.target).closest('tr').attr('id').replace('top_','') )
    obj.set( 'top' , $(e.target).val() )
  },
  Event_left : function(e){
    var obj = SVGElemCollect.get( $(e.target).closest('tr').attr('id').replace('left_','') )
    obj.set( 'left' , $(e.target).val() )
  },
  Event_type : function(e){
    var obj = SVGElemCollect.get( $(e.target).closest('tr').attr('id').replace('type_','') )
    obj.set( 'type' , $(e.target).val() )
  },
  Event_fill : function(e){
    var obj = SVGElemCollect.get( $(e.target).closest('tr').attr('id').replace('fill_','') )
    obj.set( 'fill' , $(e.target).val() )
  },
  
  render : function(){
    $(this.$el).empty().append(
                                $(this.template).tmpl({
                                                        model   : this.model
                                                      })
                              )
  },  
  
})

// Результат
var SVGResView = Backbone.View.extend({
  el : '#res_svg',
  template : '#tpl_res_svg',
  collection : SVGElemCollect,
  initialize : function(){
    this.listenTo( this.collection , 'change' , this.render )
    this.listenTo( this.collection , 'add' , this.render )
    this.listenTo( SVG , 'change' , this.render )
    this.render()
  },
  render : function(){
    $(this.$el).empty().append(
                        $(this.template).tmpl({
                                                model     : SVG,
                                                elems : this.collection.toArray()
                                              })
                      )
  }
})

// Каждый элемент по отдельности
var SVGElemView = Backbone.View.extend({
  el : '#prepend_add',
  template : '#tpl_add_elem_svg',
  initialize : function(){
    this.render()
  },
  render : function(){
    
    $(this.$el).before(
                        $(this.template).tmpl({
                                                model     : this.model,
                                                forms     : Forms.toJSON(),
                                                colors    : Colors.toJSON(),
                                              })
                      )
    
  }
})



$(document).ready(function(){
  new FormSVGView();
})
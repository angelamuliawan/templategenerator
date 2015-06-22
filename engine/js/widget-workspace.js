/* Properties - global variable*/
var cursorMode = 0;
dragElement = null;
// 0=numerik, 1=color, 2=ddl(option), 3=other(text)
var listProperties = 
	[
		{
			name:"background-color",
			valueType:1
		},{
			name:"color",
			valueType:1
		},{
			name:"background-position",
			valueType:3
		},{
			name:"background-size",
			valueType:3
		},{
			name:"background-repeat",
			valueType:2,
			data:[]
		},{
			name:"width",
			valueType:0,
			data:"px"
		},{
			name:"height",
			valueType:0,
			data:"px"
		},{
			name:"border-size",
			valueType:0,
			data:"px"
		},{
			name:"border-color",
			valueType:1
		},{
			name:"border-style",
			valueType:2,
			data:["solid",'ridge']
		},{
			name:"margin",
			valueType:0,
			data:"px"
		},{
			name:"padding",
			valueType:0,
			data:"px"
		}
	];
var listEvents = 
	[
		"background",
		"width",
		"height",
		"border",
		"margin",
		"padding"
	];
var normalOffsetLeft = 0;
var normalOffsetTop = 0;
var normalHeight = 0;
var normalWidth = 0;
var startPointerLeft = 0;
var startPointerTop = 0;
var startDragWidgetLeft = 0;
var startDragWidgetRight = 0;
var startDragWidgetBottom = 0;
var startDragWidgetTop = 0;
selectedElement = null;
var tempTop = 0;
var tempLeft = 0;
var WIDGETELEMENTCLASS = "widgetElement";

/* End Properties */
/* Method - global function */
var changeColorPickerHandler = 
		function(e){
			console.log()
		}
var changePropertiesHandler = 
		function(e){
			$(this).addClass("syncVal");
			var popupTop = $(this).offset().top;
			var popupLeft = $("#propertiesSection").offset().left + $("#propertiesSection").width();
			var propertiesIndex = $(this).attr("data-index");
			var divPopup = $("#changeValTemplate"+listProperties[propertiesIndex].valueType).clone().attr("id","popupValue");
			$(divPopup).offset({
				top:popupTop,
				left:popupLeft
			}).css({
				height:$(this).height()+"px",
				'margin-left':"0.5%",
				position:"absolute",
				"width":(screen.width-popupLeft-2*screen.width/100)+"px"
			})
			$("body").append(divPopup);
			switch(listProperties[propertiesIndex].valueType){
				case 0:
					$(".changedVal",divPopup).TouchSpin({
						min:-10000,
						max:10000,
						boostat: 5,
						postfix:listProperties[propertiesIndex].data,
						initval:$(this).text().replace(listProperties[propertiesIndex].data,"")
					})
				break;
				case 1:
					$(".changedVal",divPopup).colorpicker({
						format:"rgba",
						color:$(this).text()
					}).on('changeColor.colorpicker', function(e){
						var rgbVal = e.color.toRGB();
						$(".syncVal").text("rgba("+rgbVal.r+","+rgbVal.g+","+rgbVal.b+","+rgbVal.a+")");
						$(selectedElement).css($(".syncVal").attr("id").replace("Value",""),$(".syncVal").text());
					});
				break;
				case 2:
					$(listProperties[propertiesIndex].data).each(function(){
						$(".changedVal",divPopup).append($("<option value='"+this+"'>"+this+"</option>"));
					})
					$(".changedVal",divPopup).val($(".syncVal").text()).change(function(){
						$(".syncVal").text($(this).val());
						$(selectedElement).css($(".syncVal").attr("id").replace("Value",""),$(".syncVal").text());
					})
				break;
			}
		}
var changedPropVal = 
		function(e){
			$(".syncVal").text($(this).val());
		};
var dragElementStart = 
		function(e){
			e.preventDefault();
			dragElement = e.target;
			$(e.target).addClass("draggedElement");
			normalOffsetLeft = $(e.target).offset().left;
			normalOffsetTop = $(e.target).offset().top;
			normalWidth = $(e.target).width();
			normalHeight = $(e.target).height();
			startDragWidgetLeft = e.pageX-$(e.target).offset().left;
			startDragWidgetRight = $(e.target).offset().left + $(e.target).width() - e.pageX;
			startDragWidgetTop = $(e.target).offset().top + $(e.target).height() - e.pageY;
			startDragWidgetTop = e.pageY-$(e.target).offset().top;
		};
var dragMove = 
		function(e){
			if(dragElement){
				console.log(cursorMode);
				switch(cursorMode){
					case 0:
					var newLeft = e.pageX-startDragWidgetLeft;
					var newTop = e.pageY-startDragWidgetTop;
					if(newLeft<$("#editSection").offset().left)
						newLeft = $("#editSection").offset().left;
					else if(e.pageX + startDragWidgetRight > $("#editSection").offset().left+$("#editSection").width())
						newLeft = $("#editSection").offset().left + $("#editSection").width()-$(dragElement).width();
					if(newTop<$("#editSection").offset().top)
						newTop = $("#editSection").offset().top = newTop;
					else if(e.pageY + startDragWidgetTop > $("#editSection").offset().top+$("#editSection").height())
						newTop = $("#editSection").offset().top + $("#editSection").height()-$(dragElement).height();
					
					$(dragElement).offset({
						left:newLeft,
						top:newTop
					})
					break;
					case 1:
					//kiri-bawah kanan-atas
					break;
					case 2:
					//kiri-atas kanan-bawah
					var divX = e.pageX - startDragWidgetLeft - normalOffsetLeft;
					var divY = e.pageY - startDragWidgetTop - normalOffsetTop;
					$(dragElement).offset({
						left:normalOffsetLeft+divX,
						top:normalOffsetTop+divY
					})
					$(dragElement).width(normalWidth+Math.sqrt(Math.pow(divX,2)));
					$(dragElement).height(normalHeight+Math.sqrt(Math.pow(divY,2)));
					break;
					case 3:
					//kiri kanan
					var divX = e.pageX - startDragWidgetLeft - normalOffsetLeft;
					if(startDragWidgetLeft > normalWidth/2){
						//kanan
						$(dragElement).width(normalWidth+Math.sqrt(Math.pow(divX,2)));
					}
					else{
						//kiri
						$(dragElement).offset({
							left:normalOffsetLeft+divX
						})
						$(dragElement).width(normalWidth+Math.sqrt(Math.pow(divX,2)));
					}
					break;
					case 4:
					//atas bawah
					var divY = e.pageY - startDragWidgetTop - normalOffsetTop;
					if(startDragWidgetTop >normalHeight/2){
						//bawah
						$(dragElement).height(normalHeight+Math.sqrt(Math.pow(divY,2)));
					}
					else{
						//atas
						$(dragElement).offset({
							top:normalOffsetTop+divY
						})
						$(dragElement).height(normalHeight+Math.sqrt(Math.pow(divY,2)));
					}
					break;
				}							
			}
		}
var dropHandler =
		function(e){
			var tempElement = $(".dragItem").clone().addClass("widgetElement").removeAttr("draggable").css({
									"cursor":"move",
									"-webkit-touch-callout": "none",
									"-webkit-user-select": "none",
									"-khtml-user-select": "none",
									"-moz-user-select": "none",
									"-ms-user-select": "none",
									"user-select": "none"
								});
			$(tempElement).css({
				position:"absolute",
				top:e.originalEvent.clientY+document.body.scrollTop-$(this).offset().top-startPointerTop,
				left:e.originalEvent.clientX+document.body.scrollLeft-$(this).offset().left-startPointerLeft,
			});
			$(tempElement).click(editProp).on("mousedown",dragElementStart).mousemove(widgetElementHover);
			$(this).append(tempElement);
			$(".dragItem").removeClass("dragItem");
			e.preventDefault();
		};
var eachListProperties = 
		function(i){
			$("#bodyProperty").append($("<tr><td>"+this.name+"</td><td class='editValue' id='"+this.name+"Value' data-index='"+i+"'></td></tr>"))
		}
var eachListEvent = 
		function(i){
			
		}
var editProp = 
		function(e){
			e.preventDefault();
			selectedElement = this;
			loadProperties(this);
			$(".editValue").click(changePropertiesHandler);
		};
var globalMouseUp = 
		function(e){
			dragElement = null;
			$(".draggedElement").removeClass("draggedElement");
		}
var globalMouseDown = 
		function(e){		
			var container = $("#popupValue,.syncVal");

			if (!container.is(e.target) // if the target of the click isn't the container...
				&& container.has(e.target).length === 0) // ... nor a descendant of the container
			{
				$("#popupValue").remove();
				$(".syncVal").removeClass("syncVal");
			}
		}
var loadProperties = 
		function(object){
			$("#classValue").val($(object).attr("class").replace(WIDGETELEMENTCLASS," "));
			$("#idValue").val($(object).attr("id"));
			for(var i=0;i<listProperties.length;i++){
				console.log(listProperties[i]);
				$("#"+listProperties[i].name+"Value").text($(object).css(listProperties[i].name));
			}			
		};
var normalWidgetDragStartHandler = 
		function(e){
			$(".dragItem").removeClass("dragItem");
			$(this).addClass("dragItem");
			startPointerLeft = e.originalEvent.clientX+document.body.scrollLeft-$(this).offset().left;
			startPointerTop = e.originalEvent.clientY+document.body.scrollTop-$(this).offset().top;
		}
var widgetElementHover =
		function(e){
			if($(".draggedElement").length>0)return;
			if((e.pageX <= $(e.target).offset().left+5&&e.pageY >= $(e.target).height() + $(e.target).offset().top - 5)
				||
				(e.pageX >= $(e.target).width() + $(e.target).offset().left - 5 && e.pageY <= $(e.target).offset().top+5)){
				//kiri-bawah kanan-atas
				$(e.target).css("cursor","ne-resize");
				cursorMode = 1;
			}
			else if((e.pageX <= $(e.target).offset().left+5&&e.pageY <= $(e.target).offset().top+5)
					||
					(e.pageX >= $(e.target).width() + $(e.target).offset().left - 5 &&e.pageY >= $(e.target).height() + $(e.target).offset().top - 5)){
				//kiri-atas kanan-bawah
				$(e.target).css("cursor","nw-resize");
				cursorMode = 2;
			}
			else if(e.pageX <= $(e.target).offset().left+5||e.pageX >= $(e.target).width() + $(e.target).offset().left - 5){
				//kiri kanan
				$(e.target).css("cursor","e-resize");
				cursorMode = 3;
			}
			else if(e.pageY <= $(e.target).offset().top+5||e.pageY >= $(e.target).height() + $(e.target).offset().top - 5){
				//atas bawah
				$(e.target).css("cursor","n-resize");
				cursorMode = 4;
			}
			else{
				//tengah
				$(e.target).css("cursor","move");
				cursorMode = 0;
			}
		}
/* End Method*/
/* setting by jQuery */
$(document).ready(function(e){
		$("#listWidget,#editSection").on("dragover",function(e){
			e.preventDefault();
		});
		$(window).on("mouseup",globalMouseUp);
		$("#editSection").on("drop",dropHandler).mousemove(dragMove);
		$("#listWidget *").attr("draggable",true);
		$("#listWidget *").on("dragstart",normalWidgetDragStartHandler);
		$("#editSection *").click(editProp);
		$(document).mousedown(globalMouseDown);
		$(listProperties).each(eachListProperties);
		$(listEvents).each(eachListEvent);
});
/* End Setting */
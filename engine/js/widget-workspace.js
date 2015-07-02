/* Properties - global variable*/
var accrossPoint = {};
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
var listSpecialProperties = [];
var listInitFunction = {
	"img":function(){}
};
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
var changePropertiesHandler = 
		function(e){
			$(this).addClass("syncVal");
			var popupTop = $(this).offset().top + $(this).height();
			var popupLeft = $(this).offset().left-30;
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
			e.target = $(e.target).parent()[0];
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
					var newWidth = e.pageX - accrossPoint.x;
					var newHeight = e.pageY - accrossPoint.y;
					if(startDragWidgetLeft > normalWidth/2){
						//kanan-bawah
						$(dragElement).width(Math.sqrt(Math.pow(newWidth,2)));
						$(dragElement).height(Math.sqrt(Math.pow(newHeight,2)));
					}
					else{
						//kiri-atas
						$(dragElement).offset({
							left:e.pageX,
							top:e.pageY
						})
						$(dragElement).width(Math.sqrt(Math.pow(newWidth,2)));
						$(dragElement).height(Math.sqrt(Math.pow(newHeight,2)));
					}
					break;
					case 2:
					//kiri-atas kanan-bawah
					var newWidth = e.pageX - accrossPoint.x;
					var newHeight = e.pageY - accrossPoint.y;
					if(startDragWidgetLeft > normalWidth/2){
						//kanan-bawah
						$(dragElement).width(Math.sqrt(Math.pow(newWidth,2)));
						$(dragElement).height(Math.sqrt(Math.pow(newHeight,2)));
					}
					else{
						//kiri-atas
						$(dragElement).offset({
							left:e.pageX,
							top:e.pageY
						})
						$(dragElement).width(Math.sqrt(Math.pow(newWidth,2)));
						$(dragElement).height(Math.sqrt(Math.pow(newHeight,2)));
					}
					break;
					case 3:
					//kiri kanan
					var newWidth = e.pageX - accrossPoint.x;
					if(startDragWidgetLeft > normalWidth/2){
						//kanan
						$(dragElement).width(Math.sqrt(Math.pow(newWidth,2)));
					}
					else{
						//kiri
						$(dragElement).offset({
							left:e.pageX
						})
						$(dragElement).width(Math.sqrt(Math.pow(newWidth,2)));
					}
					break;
					case 4:
					//atas bawah
					var newHeight = e.pageY - accrossPoint.y;
					if(startDragWidgetTop >normalHeight/2){
						//bawah
						$(dragElement).height(Math.sqrt(Math.pow(newHeight,2)));
					}
					else{
						//atas
						$(dragElement).offset({
							top:e.pageY
						})
						$(dragElement).height(Math.sqrt(Math.pow(newHeight,2)));
					}
					break;
				}							
			}
		}
var dropHandler =
		function(e){
			var tempElement = $(".dragItem").next().find(".cloneElement").clone().css({
									'width':'100%',
									"height":"100%"
								});
			var container = $("#widgetContainer").clone().removeAttr("id");
			$(container).css({
				position:"absolute",
				top:e.originalEvent.clientY+document.body.scrollTop-$(this).offset().top-startPointerTop,
				left:e.originalEvent.clientX+document.body.scrollLeft-$(this).offset().left-startPointerLeft,
			})
			$(container).append(tempElement);
			$(this).append(container);
			var widgetCover = $("<div>").addClass("widgetElement").css({
									"position":"absolute",
									"cursor":"move",
									"-webkit-touch-callout": "none",
									"-webkit-user-select": "none",
									"-khtml-user-select": "none",
									"-moz-user-select": "none",
									"-ms-user-select": "none",
									"user-select": "none",
									"height":"100%",
									"width":"100%"
								});
			$(widgetCover).click(editProp).on("mousedown",dragElementStart).mousemove(widgetElementHover).hover(function(e){
				$(this).css("border","1px dashed black");
			},function(e){
				$(this).css("border","none");
			});
			$(container).prepend(widgetCover);
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
			selectedElement = $(this).next();
			loadProperties(selectedElement);
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
			e.target = $(e.target).parent()[0];
			if($(".draggedElement").length>0)return;
			if((e.pageX <= $(e.target).offset().left+5&&e.pageY >= $(e.target).height() + $(e.target).offset().top - 5)
				||
				(e.pageX >= $(e.target).width() + $(e.target).offset().left - 5 && e.pageY <= $(e.target).offset().top+5)){
				//kiri-bawah kanan-atas
				$(e.target).find(".widgetElement").css("cursor","ne-resize");
				cursorMode = 1;
				if(e.pageX <= $(e.target).offset().left+5&&e.pageY >= $(e.target).height() + $(e.target).offset().top - 5){
					//kiri-bawah
					accrossPoint.x = $(e.target).width() + $(e.target).offset().left;
					accrossPoint.y = $(e.target).offset().top;
				}
				else if(e.pageX >= $(e.target).width() + $(e.target).offset().left - 5 && e.pageY <= $(e.target).offset().top+5){
					//kanan-atas
					accrossPoint.x = $(e.target).offset().left;
					accrossPoint.y = $(e.target).height() + $(e.target).offset().top;
				}
			}
			else if((e.pageX <= $(e.target).offset().left+5&&e.pageY <= $(e.target).offset().top+5)
					||
					(e.pageX >= $(e.target).width() + $(e.target).offset().left - 5 &&e.pageY >= $(e.target).height() + $(e.target).offset().top - 5)){
				//kiri-atas kanan-bawah
				$(e.target).find(".widgetElement").css("cursor","nw-resize");
				cursorMode = 2;
				if(e.pageX <= $(e.target).offset().left+5&&e.pageY <= $(e.target).offset().top+5){
					//kiri-atas
					accrossPoint.x = $(e.target).width() + $(e.target).offset().left;
					accrossPoint.y = $(e.target).height() + $(e.target).offset().top;
				}
				else if(e.pageX >= $(e.target).width() + $(e.target).offset().left - 5 &&e.pageY >= $(e.target).height() + $(e.target).offset().top - 5){
					//kanan-bawah
					accrossPoint.x = $(e.target).offset().left;
					accrossPoint.y = $(e.target).offset().top;
				}
			}
			else if(e.pageX <= $(e.target).offset().left+5||e.pageX >= $(e.target).width() + $(e.target).offset().left - 5){
				//kiri kanan
				$(e.target).find(".widgetElement").css("cursor","e-resize");
				cursorMode = 3;
				if(e.pageX <= $(e.target).offset().left+5){
					//kiri
					accrossPoint.x = $(e.target).width() + $(e.target).offset().left;
				}
				else if(e.pageX >= $(e.target).width() + $(e.target).offset().left - 5){
					//kanan
					accrossPoint.x = $(e.target).offset().left;
				}
			}
			else if(e.pageY <= $(e.target).offset().top+5||e.pageY >= $(e.target).height() + $(e.target).offset().top - 5){
				//atas bawah
				$(e.target).find(".widgetElement").css("cursor","n-resize");
				cursorMode = 4;
				if(e.pageY <= $(e.target).offset().top+5){
					//atas
					accrossPoint.y = $(e.target).height() + $(e.target).offset().top;
				}
				else if(e.pageY >= $(e.target).height() + $(e.target).offset().top - 5){
					//bawah
					accrossPoint.y = $(e.target).offset().top;
				}
			}
			else{
				//tengah
				$(e.target).find(".widgetElement").css("cursor","move");
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
		$(".dragBlocker").attr("draggable",true);
		$(".dragBlocker").on("dragstart",normalWidgetDragStartHandler);
		$("#editSection *").click(editProp);
		$(document).mousedown(globalMouseDown);
		$(listProperties).each(eachListProperties);
		$(listEvents).each(eachListEvent);
});
/* End Setting */
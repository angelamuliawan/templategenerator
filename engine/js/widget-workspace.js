/* Properties - global variable*/
var cursorMode = 0;
dragElement = null;
var listProperties = 
	[
		"background",
		"width",
		"height",
		"border",
		"margin",
		"padding"
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
var tempTop = 0;
var tempLeft = 0;

/* End Properties */
/* Method - global function */
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
			$("#bodyProperty").append($("<tr><td>"+this+"</td><td class='editValue' id='"+this+"Value'></td></tr>"))
		}
var eachListEvent = 
		function(i){
			
		}
var editProp = 
		function(e){
			e.preventDefault();
			loadProperties(this);
		};
var globalMouseUp = 
		function(e){
			dragElement = null;
			$(".draggedElement").removeClass("draggedElement");
		}
var loadProperties = 
		function(object){
			var listPropInfo = $("<div>");
			for(var i=0;i<lisProperties.length;i++){
				$(listPropInfo).append($("<div style='border:1px solid black;width:45%;margin:1%;float:left'>"+lisProperties[i]+"</div>"));
				$(listPropInfo).append($("<div style='border:1px solid black;margin:1%;width:45%;float:left;word-wrap:break-word;'>"+($(object).css(lisProperties[i])=='undefined'?"":$(object).css(lisProperties[i]))+"</div>"));
			}
			$("#propertiesSection").html(listPropInfo);						
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
		$(listProperties).each(eachListProperties);
		$(listEvents).each(eachListEvent);
});
/* End Setting */
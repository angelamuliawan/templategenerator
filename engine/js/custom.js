<script>
			/* Properties - global variable*/
			var lisProperties = 
				[
					"background",
					"width",
					"height",
					"border",
					"margin",
					"padding"
				]
			var startPointerLeft = 0;
			var startPointerTop = 0;			
			/* End Properties */
			/* Method - global function */
			var dropHandler =
					function(e){
						var tempElement = $(".dragItem").clone();
						$(tempElement).css({
							position:"absolute",
							top:e.originalEvent.clientY+document.body.scrollTop-startPointerTop,
							left:e.originalEvent.clientX+document.body.scrollLeft-startPointerLeft,
						});
						$(tempElement).click(editProp);
						$(tempElement).mousedown(editElementMouseDown).mousemove(editElementMouseMove).mouseup(editElementMouseUp);
						$(this).append(tempElement);
						$(".dragItem").removeClass("dragItem");
						e.preventDefault();
					};
			var editElementMouseDown = 
					function(e){
					}
			var editElementMouseMove = 
					function(e){
					}
			var editElementMouseUp = 
					function(e){
					}
			var editProp = 
					function(e){
						e.preventDefault();
						loadProperties(this);
					};
			var loadProperties = 
					function(object){
						console.log(object);
						var listPropInfo = $("<div>");
						for(var i=0;i<lisProperties.length;i++){
							$(listPropInfo).append($("<div style='border:1px solid black;width:45%;margin:1%;float:left'>"+lisProperties[i]+"</div>"));
							$(listPropInfo).append($("<div style='border:1px solid black;width:45%;margin:1%;float:left'>"+($(object).css(lisProperties[i])=='undefined'?"":$(object).css(lisProperties[i]))+"</div>"));
						}
						$("#propertiesSection").html(listPropInfo);						
					};
			var normalWidgetDragStartHandler = 
					function(e){
						$(".dragItem").removeClass("dragItem");
						$(this).addClass("dragItem");
						startPointerLeft = e.originalEvent.clientX+document.body.scrollLeft-$(this).offset().left;
						startPointerTop = e.originalEvent.clientY+document.body.scrollTop-$(this).offset().top;
						console.log(startPointerLeft+","+startPointerTop);
					}
			/* End Method*/
			/* setting by jQuery */
			$(document).ready(function(e){
					$("#listWidget,#editSection").on("dragover",function(e){
						e.preventDefault();
					});
					$("#editSection").on("drop",dropHandler);
					$("#listWidget *").attr("draggable",true);
					$("#listWidget *").on("dragstart",normalWidgetDragStartHandler);
					$("#editSection *").click(editProp);
			});
			/* End Setting */
		</script>
/**
 * 
 */	
var block = {loaded : false};

$(function () {
	setupLargeSelect()
	
});
function loadBlock(lIdn, mIdn,callback){
	var block_urls = ['/sub/getLarges.html',
        '/sub/getMiddle.html',
        '/sub/getSmall.html'
        ];
	
	var level = !lIdn&&!mIdn ? 0 : !mIdn ? 1 : 2;
	var data = lIdn&&mIdn ? {"idn":mIdn} : lIdn ? {"idn":lIdn} : {}; 

	$.ajax({
		url : SN.Root + block_urls[level],
		data : data,
		type : 'GET',
		success : function(r) {
			if (r) {
				switch (level) {
				case 0:
					block.data = JSON.parse(r);
					block.loaded = true;
					setupLargeSelect();
					break;
				case 1:
					middleBlock = block.data.find(x => x.idn === lIdn);
					middleBlock.data = JSON.parse(r);
					middleBlock.loaded = true;
					setupMiddleSelect();
					break;
				case 2:
					smallBlock = block.data.find(x => x.idn === lIdn).data.find(x => x.idn === mIdn);
					smallBlock.data = JSON.parse(r);
					smallBlock.loaded = true;
					setupSmallSelect();
					break;
				default:
					break;
				} 
				
			} else {
				console.log("No result")
			}
			callback();
		},
		complete : function() {
			parent.endProgres();
			if (parent.stopProgress)
				parent.stopProgress();
			else {
				//stopProgress();
			}
		}
	})
}

function setupLargeSelect(){
	$('#largeblock').empty();
	$('#middleblock').empty();
	$('#smallblock').empty();
//	$('#middleblock').append($('<option></option>').attr("value", "").text("-전체-"));
//	$('#smallblock').append($('<option></option>').attr("value", "").text("-전체-"));
	
	if(!block.loaded){
		$('#largeblock').attr('disabled', 'disabled');
		loadBlock(null,null,setupMiddleSelect);
	} else {
		var data = block.data/*.sort(function(a, b) {
		    return a.name.localeCompare(b.name, undefined, {numeric: true, sensitivity: 'base'});
		});*/
//		$('#largeblock').append($('<option></option>').attr("value", "").text("-전체-"));
		for ( var i in data) {
			var option = $('<option></option>').attr("value", data[i].idn).text(data[i].name);
			$('#largeblock').append(option);
		}
		$('#largeblock').removeAttr('disabled');
		$('#largeblock').unbind('change').change(setupMiddleSelect);
		setupMiddleSelect();
	} 
}

function setupMiddleSelect(){
	$('#middleblock').empty();
	$('#smallblock').empty(); 
//	$('#smallblock').append($('<option></option>').attr("value", "").text("-전체-"));
	var lId = $('#largeblock').val();
	if(lId){
		var mblock = block.data.find(x => x.idn === lId);
		if(!mblock.loaded){
			$('#middleblock').attr('disabled', 'disabled');
			loadBlock(lId,null,setupMiddleSelect);
		} else {
			var data = mblock.data/*.sort(function(a, b) {
			    return a.name.localeCompare(b.name, undefined, {numeric: true, sensitivity: 'base'});
			});*/
//			$('#middleblock').append($('<option></option>').attr("value", "").text("-전체-"));
			for ( var i in data) {
				var option = $('<option></option>').attr("value", data[i].idn).text(data[i].name);
				$('#middleblock').append(option);	
			}
			$('#middleblock').removeAttr('disabled');
			$('#middleblock').unbind('change').change(setupSmallSelect);
			setupSmallSelect();
		}
	} else {

//		$('#middleblock').append($('<option></option>').attr("value", "").text("-전체-"));
	}
	
}

function setupSmallSelect(){
	$('#smallblock').empty();
	var lId = $('#largeblock').val();
	var mId = $('#middleblock').val();
	abnormal.middleblock = mId;
	if(lId && mId){
		var sblock = block.data.find(x => x.idn === lId).data.find(x => x.idn === mId);
		if(!sblock.loaded){
			$('#smallblock').attr('disabled', 'disabled');
			loadBlock(lId, mId,setupSmallSelect);
		} else {
			var data = sblock.data/*.sort(function(a, b) {
			    return a.name.localeCompare(b.name, undefined, {numeric: true, sensitivity: 'base'});
			});*/
//			$('#smallblock').append($('<option></option>').attr("value", "").text("-전체-"));
			for ( var i in data) {
				var option = $('<option></option>').attr("value", data[i].idn).text(data[i].name);
				$('#smallblock').append(option);	
			}
			$('#smallblock').change();
			$('#smallblock').removeAttr('disabled');
		}	
	} else {

//		$('#smallblock').append($('<option></option>').attr("value", "").text("-전체-"));
	}
}
/*
loadScript('public/js/develop/svgclass.js', callBackFunction);
loadScript('public/js/source/datatablebuttons.js');
loadScript('public/js/source/jszip.js');
loadScript('public/js/source/datatablehtml5buttons.js');
*/

let bindArray = ['без привязки','ЦПП','АЗС АТЦ','ГСМ "Отвальная"','ГСМ "Промышленная"'];

function loadScript(url, callback)
{
    // Adding the script tag to the head as suggested before
    var body = document.body;
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    body.appendChild(script);
}

let StopFillPlcCmd = 5;
let StartFillPlcCmd = 22;

$(document).ready(function(){
//function callBackFunction(){
    var now = new Date();
    var timetext = now.toLocaleTimeString();
	var day = ("0" + now.getDate()).slice(-2);
	var pday = ("0" + (now.getDate()-1)).slice(-2);	
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
	var today = now.getFullYear()+"-"+(month)+"-"+(day);
	var yesterday = now.getFullYear()+"-"+(month)+"-"+(pday);
    var dt = setInterval("getActCount()", 5*1000);
    $('#dpicker').val(today);
	$('#tpicker').val("00:00:00");
	$('#dfnpicker').val(today);
    $('#tfnpicker').val("00:00:00");
	$('#dstpicker').val(yesterday);
    $('#tstpicker').val("00:00:00");
	getCurTime();
	getActCount();

	$('[data-toggle="tooltip"]').tooltip();

	$(window).scroll(function(){
		if ($(this).scrollTop() > 200) {
			$('.scrollup').fadeIn();
		}
		else{
			$('.scrollup').fadeOut();
		}
    });

    $('.scrollup').click(function(){
	    $("html, body").animate({ scrollTop: 0 }, 500);
	    return false;
    });

    if(isEnCtrl() == 0){
        $(".addfill").css('display','none');
    }
    else{
        $(".addfill").css('display','in-line');
    }

    $('.addfill').click(function(){
        let ElemId = $( this ).attr('id');
        createNewFillForm(ElemId);
    });

    $('.monreport').click(function(){
        let ElemId = $( this ).attr('id');
        createMonthReportShowForm(ElemId);
    });

    btnStyleAndEvents();

    $('.modal').on('hidden.bs.modal', function(event) {
        $(this).removeClass( 'fv-modal-stack' );
        $('body').data( 'fv_open_modals', $('body').data( 'fv_open_modals' ) - 1 );
    });

   $(document).on('show.bs.modal', '.modal', function () {
        var zIndex = 1040 + (10 * $('.modal:visible').length);
        $(this).css('z-index', zIndex);
        setTimeout(function() {
            $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
        }, 0);
    });

    $('#contactlink').click(function(){
        showContactForm();
    });  
    
    $('#contactForm').submit(function(event) {
        let prdir = $('#prdir').text();
		event.preventDefault();
		$.ajax({
			type: $(this).attr('method'),
			url: '../'+prdir+'app/ajax/ajaxroutes.php',//$(this).attr('action'),
			data: new FormData(this),
			contentType: false,
			cache: false,
			processData: false,
			success: function(result) {
                let resdata = jQuery.parseJSON(result);
                let json = resdata.data;
                if(json.status === "error"){
                    swal(json.status, json.status + ' - ' + json.message, json.status);                  
                }
                else{
                    swal(json.status, json.status + ' - ' + json.message, json.status)
                    .then(function(val){
                        $('.form-control').val('');
                        $('#contact').modal("hide");
                    });
                }	
            },
            error: function(err){
                console.log(err);
            }
		});
	});

//}
});
// ----------------------------------------
// ================= button style and Events =================

function btnStyleAndEvents(){
    // ----------- meter detail buttons -----------
    $(".control").bind("click",function(elem){
        let ctrlId = $( this ).attr('id').substr(2);
        showMeterWindow(ctrlId);
    });
    $(".control").mouseover(function() {
        $( this ).css('cursor', 'pointer');
        let ElemId = $( this ).attr('id');
        $('#' + ElemId + ' .svgbtn').css('fill', 'rgb(18,130,145)');
    });
    $(".control").mouseout(function() {
        let ElemId = $( this ).attr('id');
        $('#' + ElemId + ' .svgbtn').css('fill', 'rgb(28,195,221)');
    });
    // ----------- meter tables -----------
    $(".meter").mouseover(function() {
        $( this ).css('cursor', 'pointer');
    }); 
    $(".meter").bind("click",function(elem){
        let ctrlId = $( this ).attr('id').substr(1);
        showMeterWindow(ctrlId);
    });
    // ----------- tanks -----------
    $(".vlevel").bind("click",function(elem){
        let ctrlId = $( this ).attr('id').substr(1);
        showLevelWindow(ctrlId);
    });
    $(".vlevel").mouseover(function() {
        $( this ).css('cursor', 'pointer');
    }); 
    // ----------- reset buttons -----------
    $(".rTask").mouseover(function() {
        $( this ).css('cursor', 'pointer');
        let ElemId = $( this ).attr('id');
        $('#' + ElemId + ' .svgbtn').css('fill', 'rgb(160,0,0)');
    }); 

    $(".rTask").mouseout(function() {
        let ElemId = $( this ).attr('id');
        $('#' + ElemId + ' .svgbtn').css('fill', 'rgb(200,0,0)');       
    }); 

    $('#rF1').bind('click', function(e){          
        SetPumpCommand("grF1","F1", StopFillPlcCmd); // restart command
    }); 
    $('#rF2').bind('click', function(e){          
        SetPumpCommand("grF2","F2", StopFillPlcCmd); // restart command
    }); 

}

// ----------------------------------------
function ScrollToMark(linkname){
	$('html, body').animate({scrollTop:$(linkname).offset().top}, 1000);
}
// ----------------------------------------
function revMyDateFmt(val){
	var ret = "";
	var year = val.substring(6);
	var month = val.substring(3,5);
	var day = val.substring(0,2);
		ret = year+"-"+month+"-"+day;
	return ret;
}
// ----------------------------------------
function getCurTime(){
    var curdate = new Date();
    var datetext = moment(curdate).format('DD.MM.YYYY HH:mm:ss');
    $('#curtime').text(datetext);
    let seconds = moment(curdate).minutes() * 60 + moment(curdate).seconds();
    if(seconds%1800 == 0){
        window.location.reload();
    }
    setTimeout("getCurTime()",1000);
}
// ----------------------------------------
function getActCount(){
    let prdir = $('#prdir').text();
	$.ajax({
        type:'GET',
        url: '../'+prdir+'app/ajax/ajaxroutes.php/?almcount',
		cache: false,
		crossDomain: true,
		contentType: 'application/json; charset=utf-8',
		dataType: 'json',
		success: function(data){
			var unack = data.data;
			$('#actsum').text(unack);
		},
		error: function(err){
			console.log(err);
		}
    });
}
// ----------------------------------------
function SecToTimeFmt(iSec){
    var days = (parseInt(iSec / 86400)>0) ? parseInt(iSec / 86400).toString() + "д. " : "";
	var hours = parseInt((iSec%86400) / 3600).toString();
	if(hours.length < 2)
		hours = "0" + hours;
	return days + hours + ":" + ("0" + parseInt((iSec%3600)/60).toString()).slice(-2) + ":" + ("0" + (iSec%60).toString()).slice(-2);
}
// ----------------------------------------
function DateToFmtString(date){
	var gdate = new Date(date);
	var day = ("0" + gdate.getDate()).slice(-2);
	var month = ("0" + (gdate.getMonth() + 1)).slice(-2);
	var gdatedate = day + "." + month + "." + gdate.getFullYear();
	var hour = ("0" + gdate.getHours()).slice(-2);
	var minute = ("0" + gdate.getMinutes()).slice(-2);
	var second = ("0" + gdate.getSeconds()).slice(-2);
	var gdatetime = hour + ":" + minute + ":" + second;
	return gdatedate + " " + gdatetime;
}

function GetDateFromStr(str){
	return new Date(str.substring(0,10) + "T" + str.substring(11,19) + "");
}

function isEnCtrl(){
    return parseInt($('#enctrl').text());
}

function userDepartment(){
    return parseInt($('#department').text());
}

// ---------- set SVG objects on Page ---------------

function showPageContent(data){
    let indata = data.data;
    // ******* levels *******
    let levelsClass = $('.vlevel');
    for(let i=0; i < levelsClass.length; i++){
        let sElemName = levelsClass[i].id.substr(1);
        for(let j=0; j < indata.tanks.length; j++){
            if(indata.tanks[j].web_name === sElemName){
                Svg.setLevelObj(sElemName,indata.tanks[j]);
            }
        }
    }
    // ******* flowmeters *******
    let metersClass = $('.meter');
    for(let i=0; i < metersClass.length; i++){
        let sElemName = metersClass[i].id.substr(1);
        for(let j=0; j < indata.meters.length; j++){
            if(indata.meters[j].web_name === sElemName){
                Svg.setMeterObj(sElemName, indata.meters[j]);
            }
        }
    }
    // ******* pumps *******
    let pumpsClass = $('.pump');
    for(let i=0; i < pumpsClass.length; i++){
        let sElemName = pumpsClass[i].id.substr(1);
        for(let j=0; j < indata.pumps.length; j++){
            if(indata.pumps[j].web_name === sElemName){
                Svg.setPumpObj(sElemName, indata.pumps[j]);
            }
        }
    }
    // ******* plcs *******
    let plcsClass = $('.plc');
    for(let i=0; i < plcsClass.length; i++){
        let sElemName = plcsClass[i].id;// .substr(1);
        for(let j=0; j < indata.plcs.length; j++){
            if(indata.plcs[j].web_name === sElemName){
                Svg.setPlcObj(sElemName, indata.plcs[j]);
            }
        }
    }
    // ******* apps *******

    let FafnirSwTimeDiff = Math.abs(parseInt(indata.apps[0].timediff));
    let WinCCSwTimeDiff = Math.abs(parseInt(indata.apps[indata.apps.length - 1].timediff));
    //console.log(WinCCSwTimeDiff);
    (FafnirSwTimeDiff>=300) ? Svg.setVisible("appPy", 1) : Svg.setVisible("appPy", 0);
    (WinCCSwTimeDiff>=300) ? Svg.setVisible("appWinCC", 1) : Svg.setVisible("appWinCC", 0);

    // ******* reset buttons *******

    let needResetBit = 2;  // same as alarm ?

    if(isEnCtrl() == 1){
        $("#grF1").css('display','block');
        $("#grF2").css('display','block');
        //(Svg.getBit(indata.pumps[0].status, needResetBit) || Svg.getBit(indata.pumps[1].status, needResetBit)) ? $("#grF1").css('display','block') : $("#grF1").css('display','none');
        //(Svg.getBit(indata.pumps[2].status, needResetBit)) ? $("#grF2").css('display','block') : $("#grF2").css('display','none');
    }
}

function SetPumpCommand(Elem, RefUnit, command){
    let prdir = $('#prdir').text();
    let unit = RefUnit;
    $.ajax({
        type:'GET',
        url: '../'+prdir+'app/ajax/ajaxroutes.php/',
        data: { resetpump : unit, command : command },
        cache: false,
        crossDomain: true,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(data){
            $("#" + Elem).css('display','none');
            window.location.reload();
        },
        error: function(err){
            console.log(err);
        }
    }); 
}

function showContactForm(){
    $('#contact').modal("show");
}

function createNewFillForm(elemid){
    let prdir = $('#prdir').text();
    $.ajax({
        type:'GET',
        url: '../'+prdir+'app/ajax/ajaxroutes.php/',
        data: { fillunit : elemid },
        cache: false,
        crossDomain: true,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        beforeSend: function() {
            swal("Загрузка", "Подождите.\nЗагружаю данные формы...", "success");
        },
        success: function(data){
            swal.close();
            let indata = data.data;
            showNewFillForm(indata, elemid);
        },
        error: function(err){
            swal.close();
            console.log(err);
        }
    }); 
}

function showNewFillForm(data, fillunit){
    let transports = data.transports;
    let destinations = data.destinations;
    let plc_n = [];
    let tanklist = [];
    if(fillunit === "FOtv") { 
        plc_n = [{ id: 7, fillpoint : 'ППВ-100 Отвальная'}]; 
        tanklist = [
            {id : 11, fulltitle : 'PГС-25 Отвальная'},
        ];     
    }
    else if(fillunit === "FProm") { 
        plc_n = [{ id: 8, fillpoint : 'ППВ-100 Промышленная'}]; 
        tanklist = [
            {id : 12, fulltitle : 'PГС-50 Промышленная'},
        ];    
    }
    else if(fillunit === "F1") { 
        plc_n = [
            { id: 1, fillpoint : 'Optimass F1'},
            { id: 2, fillpoint : 'ППВ-100 F2'}
        ]; 
        tanklist = [
            {id : 1, fulltitle : 'Резервуар №22'},
            {id : 2, fulltitle : 'Резервуар №23'},
            {id : 3, fulltitle : 'Резервуар №24'},
            {id : 6, fulltitle : 'Резервуар №92'},
            {id : 7, fulltitle : 'Резервуар №16'}
        ];
    }

    $('#ctrlwindowcontent').empty();
    $('#ctrlwindowtitle').text("Добавление данных налива");
    let content = '';

    content += '<div class="form-group row my-2"><label for="itemtrans" class="col-sm-6 col-form-label text-info">Транспорт*</label>';
    content += '<div class="col-sm-6">' + getTranspSelector(transports, 0) + '</div></div>';
    content += '<div class="form-group row my-2"><label for="itemdest" class="col-sm-6 col-form-label text-info">Назначение</label>';
    content += '<div class="col-sm-6">' + getDestSelector(destinations, 10) + '</div></div>';
    content += '<div class="form-group row my-2"><label for="itemplc_n" class="col-sm-6 col-form-label text-info">Узел отпуска</label>';
    content += '<div class="col-sm-6"><select id="itemplc_n" class="form-control text-center">';
        for(let i = 0; i < plc_n.length; i++){
            content += '<option value="'+plc_n[i].id+'">'+plc_n[i].fillpoint+'</option>';
        }
    content += '</select></div></div>';
    content += '<p class="text-info py-0 my-0">Дата и время (начало налива) / (завершения налива)*</p>';
    content += '<div class="form-group row my-2">';
    content += '<div class="col-sm-6"><input type="text" id="datestart" class="form-control text-center" placeholder="гггг-мм-дд чч:мм:сс" value="2021-01-18 15:00:00"/></div>';
    content += '<div class="col-sm-6"><input type="text" id="dateend" class="form-control text-center" placeholder="гггг-мм-дд чч:мм:сс" value="2021-01-18 15:30:00"/></div></div>';
    content += '<div class="form-group row mt-2"><label for="itemset" class="col-sm-6 col-form-label text-info">Заданный объем,л*</label>';
    content += '<div class="col-sm-6"><input type="number" id="itemset" class="form-control text-center" min="1" max="99999" value="100"/></div></div>';
    content += '<div class="form-group row mt-2"><label for="itemvol" class="col-sm-6 col-form-label text-info">Отпущенный объем,л*</label>';
    content += '<div class="col-sm-6"><input type="number" id="itemvol" class="form-control text-center" min="1" max="99999" value="100"/></div></div>';
    content += '<div class="form-group row mt-2"><label for="itemtemp" class="col-sm-6 col-form-label text-info">Температура,°C*</label>';
    content += '<div class="col-sm-6"><input type="number" id="itemtemp" class="form-control text-center" min="-50" max="100" value="14.9" step=".1"/></div></div>';    
    content += '<div class="form-group row mt-2"><label for="itemdens" class="col-sm-6 col-form-label text-info">Плотность,т/м3*</label>';
    content += '<div class="col-sm-6"><input type="number" id="itemdens" class="form-control text-center" min="0" max="1.5" value="0.802" step=".001"/></div></div>'; 
    content += '<div class="form-group row mt-2"><label for="itemmass" class="col-sm-6 col-form-label text-info">Масса,кг*</label>';
    content += '<div class="col-sm-6"><input type="number" id="itemmass" class="form-control text-center" min="0" max="99999" value="80.2" step=".1"/></div></div>';
    content += '<div class="form-group row mt-2"><label for="itemcnt" class="col-sm-6 col-form-label text-info">Счетчик об. <small>(кон.знач.)</small>,л*</label>';
    content += '<div class="col-sm-6"><input type="number" id="itemcnt" class="form-control text-center" min="0" max="999999999999" value="0"/></div></div>';
    if(fillunit === "F1") {
        content += '<div class="form-group row mt-2"><label for="itemcntmass" class="col-sm-6 col-form-label text-info">Счетч.мас. <small>(! только F1*)</small>,кг</label>';
        content += '<div class="col-sm-6"><input type="number" id="itemcntmass" class="form-control text-center" min="-1" max="999999999999" value="-1.0" step=".1"/></div></div>';
    }
    content += '<div class="form-group row my-2"><label for="itemtank" class="col-sm-6 col-form-label text-info">Резервуар*</label>';
    content += '<div class="col-sm-6">' + getTankSelector(tanklist, 0) + '</div></div>';
    content += '<small class="text-black-50"><i>* - Заполнить обязательно</i></small>'; 

    $('#ctrlwindowcontent').append(content);
    $('.modal-bottom').empty();
    let bottom = '<button class="btn btn-info pt-1 mr-2 pr-2" style="width:47%" id="savefilldata">Сохранить</button>';
    bottom += '<button class="btn btn-outline-info pt-1 ml-2 pl-2" style="width:47%" type="button" data-dismiss="modal" id="clmodal" aria-label="Close" onclick="window.location.reload()">Закрыть</button>';
    $('.modal-bottom').append(bottom);
    $("#savefilldata").bind("click",function(elem){
        let savedata = {
            z_volume : $('#itemset').val(),
            f_volume : $('#itemvol').val(),
            temp : $('#itemtemp').val(),
            dens : $('#itemdens').val(), 
            date_start: $('#datestart').val(),
            date_end: $('#dateend').val(),
            f_mass : $('#itemmass').val(),
            counter : $('#itemcnt').val(),
            countermass : (fillunit === "F1") ? $('#itemcntmass').val() : "-1.0",
            plc_n : $('#itemplc_n').val(),
            destination : $('#itemdest').val(),             
            transport : $('#itemtrans').val(), 
            id_rez : $('#itemtank').val()           
        };

        let datestart = moment(savedata.date_start);
        let dateend = moment(savedata.date_end);
        if(!datestart.isValid()) {
            $("#datestart").css('background','yellow');
        }     
        else if(!dateend.isValid()) {
            $("#dateend").css('background','yellow');
        } 
        else{
            let sTextMessage = "Заданный объем : "+savedata.z_volume+" л,\n";
            sTextMessage += "Отпущенный объем : "+savedata.f_volume+" л,\n";
            sTextMessage += "Температура : "+savedata.temp+" °C\n";
            sTextMessage += "Плотность : "+savedata.dens+" т/м3\n";
            sTextMessage += "Масса : "+savedata.f_mass+" кг\n";
            sTextMessage += "Счетчик объема : "+savedata.counter+" л\n";
            sTextMessage += "Счетчик массы (-1) : "+savedata.countermass+" кг\n";             
            sTextMessage += "Время начала : "+moment(savedata.date_start).format('DD.MM.YYYY HH:mm:ss')+"\n";
            sTextMessage += "Время завершения : "+moment(savedata.date_end).format('DD.MM.YYYY HH:mm:ss')+"\n";
            sTextMessage += "Транспорт : "+$("#itemtrans option:selected" ).text()+"\n";
            sTextMessage += "Назначение : "+$("#itemdest option:selected" ).text()+"\n";        
            sTextMessage += "Резервуар : "+$("#itemtank option:selected" ).text()+"\n"; 
            swal({
                title: "Проверка введенных данных",
                text: sTextMessage,
                icon: "info",
                buttons:["Исправить", "Сохранить"]
            })
              .then(function(willSave){
                if (willSave) {
                    saveNewFillData(savedata);
                }
            });
        }
    });

    $('#ctrlwindow').modal("show"); 

}

function saveNewFillData(data){
    let prdir = $('#prdir').text();
    $.ajax({
        type:'GET',
        // url: '../app/core/Routes.php/',
        url: '../'+prdir+'app/ajax/ajaxroutes.php/',
        data: { savenewfilldata: JSON.stringify(data) },
        cache: false,
        crossDomain: true,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(data){
            if(data.data == true){
                $('#ctrlwindow').modal("hide"); 
                swal("Сохранено", "Данные успешно сохранены", "success").
                then(function(res){
                    window.location.reload(); 
                });
            }
            else{
                swal("Ошибка", "Не могу сохранить данные.", "error");
            }
        },
        error: function(err){
            console.log(err);
        }
    });
}

function getDestSelector(data, selectedItem){
    let select = '<select class="form-control text-center" id="itemdest">';
    for(let i = 0; i < data.length; i++){
        if(i==selectedItem){
            select += '<option value="'+data[i].id+'" selected="selected">'+data[i].name+'</option>';
        }else{
            select += '<option value="'+data[i].id+'">'+data[i].name+'</option>';         
        }
    }
    select += '</select>'; 
    return select;
}

function getTranspSelector(data, selectedItem){
    let select = '<select class="form-control text-center" id="itemtrans">';
    for(let i = 0; i < data.length; i++){
        if(i==selectedItem){
            select += '<option value="'+data[i].id+'" selected="selected">'+data[i].num+'</option>';
        }else{
            select += '<option value="'+data[i].id+'">'+data[i].num+'</option>';         
        }
    }
    select += '</select>'; 
    return select;
}

function getTankSelector(data, selectedItem){
    let select = '<select class="form-control text-center" id="itemtank">';
    for(let i = 0; i < data.length; i++){
        if(i==selectedItem){
            select += '<option value="'+data[i].id+'" selected="selected">'+data[i].fulltitle+'</option>';
        }else{
            select += '<option value="'+data[i].id+'">'+data[i].fulltitle+'</option>';         
        }
    }
    select += '</select>'; 
    return select;
}

function getSingleFill(rec_id){
    let prdir = $('#prdir').text();
    $.ajax({
        type:'GET',
        url: '../'+prdir+'app/ajax/ajaxroutes.php/',
        data: { fillid : rec_id },
        cache: false,
        crossDomain: true,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        beforeSend: function() {
            swal("Загрузка", "Подождите.\nЗагружаю данные формы...", "success");
        },
        success: function(data){
            swal.close();
            let indata = data.data[0];
            console.log(indata);
            showSelectedFillForm(indata);
        },
        error: function(err){
            swal.close();
            console.log(err);
        }
    }); 
}

function showSelectedFillForm(data){
    $('#ctrlwindowcontent').empty();
    $('#ctrlwindowtitle').text("Добавление данных налива");
    let content = '';

    content += '<div class="form-group row my-2"><label for="itemtrans" class="col-sm-6 col-form-label text-info">Транспорт</label>';
    content += '<div class="col-sm-6">' + data.transport + '</div></div>';
    content += '<div class="form-group row my-2"><label for="itemdest" class="col-sm-6 col-form-label text-info">Назначение</label>';
    content += '<div class="col-sm-6">' + data.destination + '</div></div>';
    content += '<div class="form-group row my-2"><label for="itemplc_n" class="col-sm-6 col-form-label text-info">Узел отпуска</label>';
    content += '<div class="col-sm-6">'+data.meter+'</div></div>';
    content += '<p class="text-info py-0 my-0">Дата и время (начало налива) / (завершения налива)</p>';
    content += '<div class="form-group row my-2">';
    content += '<div class="col-sm-6"><input type="text" id="datestart" class="form-control text-center" placeholder="гггг-мм-дд чч:мм:сс" value="'+data.date_start+'"/></div>';
    content += '<div class="col-sm-6"><input type="text" id="dateend" class="form-control text-center" placeholder="гггг-мм-дд чч:мм:сс" value="'+data.date_end+'"/></div></div>';
    content += '<div class="form-group row mt-2"><label for="itemset" class="col-sm-6 col-form-label text-info">Заданный объем,л</label>';
    content += '<div class="col-sm-6"><input type="number" id="itemset" class="form-control text-center" min="1" max="99999" value="'+data.z_volume+'"/></div></div>';
    content += '<div class="form-group row mt-2"><label for="itemvol" class="col-sm-6 col-form-label text-info">Отпущенный объем,л</label>';
    content += '<div class="col-sm-6"><input type="number" id="itemvol" class="form-control text-center" min="1" max="99999" value="'+data.f_volume+'"/></div></div>';
    content += '<div class="form-group row mt-2"><label for="itemtemp" class="col-sm-6 col-form-label text-info">Температура,°C</label>';
    content += '<div class="col-sm-6"><input type="number" id="itemtemp" class="form-control text-center" min="-50" max="100" value="'+data.temp+'" step=".1"/></div></div>';    
    content += '<div class="form-group row mt-2"><label for="itemdens" class="col-sm-6 col-form-label text-info">Плотность,т/м3</label>';
    content += '<div class="col-sm-6"><input type="number" id="itemdens" class="form-control text-center" min="-1" max="1.5" value="'+data.dens+'" step=".0001"/></div></div>'; 
    content += '<div class="form-group row mt-2"><label for="itemmass" class="col-sm-6 col-form-label text-info">Масса,кг</label>';
    content += '<div class="col-sm-6"><input type="number" id="itemmass" class="form-control text-center" min="-1" max="999999" value="'+data.f_mass+'" step=".001"/></div></div>';
    content += '<div class="form-group row mt-2"><label for="itemcnt" class="col-sm-6 col-form-label text-info">Счетчик об. <small>(кон.знач.)</small>,л</label>';
    content += '<div class="col-sm-6"><input type="number" id="itemcnt" class="form-control text-center" min="0" max="999999999999" value="'+data.counter+'"/></div></div>';
    content += '<div class="form-group row mt-2"><label for="itemcntmass" class="col-sm-6 col-form-label text-info">Счетч.мас. <small>(! только F1)</small>,кг</label>';
    content += '<div class="col-sm-6"><input type="number" id="itemcntmass" class="form-control text-center" min="-1" max="999999999999" value="'+data.countermass+'" step=".1"/></div></div>';
    content += '<div class="form-group row my-2"><label for="itemtank" class="col-sm-6 col-form-label text-info">Резервуар</label>';
    content += '<div class="col-sm-6">' + data.tank + '</div></div>';
    content += '<div class="form-group row my-2"><label for="itemfuel" class="col-sm-6 col-form-label text-info">Топливо</label>';
    content += '<div class="col-sm-6">' + data.fueltype + '</div></div>';    
    $('#ctrlwindowcontent').append(content);
    $('.modal-bottom').empty();
    let bottom = '';
    if(isEnCtrl != 0){
        bottom = '<button class="btn btn-info pt-1 mr-2 pr-2" style="width:47%" id="savefilldata">Сохранить</button>';
    }
    bottom += '<button class="btn btn-outline-info pt-1 ml-2 pl-2" style="width:47%" type="button" data-dismiss="modal" id="clmodal" aria-label="Close" onclick="window.location.reload()">Закрыть</button>';
    $('.modal-bottom').append(bottom);
    $("#savefilldata").bind("click",function(elem){
        let savedata = {
            id : data.id,
            z_volume : $('#itemset').val(),
            f_volume : $('#itemvol').val(),
            temp : $('#itemtemp').val(),
            dens : $('#itemdens').val(), 
            date_start: $('#datestart').val(),
            date_end: $('#dateend').val(),
            f_mass : $('#itemmass').val(),
            counter : $('#itemcnt').val(),
            countermass : $('#itemcntmass').val()
        };

        let datestart = moment(savedata.date_start);
        let dateend = moment(savedata.date_end);
        if(!datestart.isValid()) {
            $("#datestart").css('background','yellow');
        }     
        else if(!dateend.isValid()) {
            $("#dateend").css('background','yellow');
        } 
        else{
            let sTextMessage = "ID транзакции : "+savedata.id+",\n";
            sTextMessage += "Заданный объем : "+savedata.z_volume+" л,\n";
            sTextMessage += "Отпущенный объем : "+savedata.f_volume+" л,\n";
            sTextMessage += "Температура : "+savedata.temp+" °C\n";
            sTextMessage += "Плотность : "+savedata.dens+" т/м3\n";
            sTextMessage += "Масса : "+savedata.f_mass+" кг\n";
            sTextMessage += "Счетчик объема : "+savedata.counter+" л\n";
            sTextMessage += "Счетчик массы (-1) : "+savedata.countermass+" кг\n";             
            sTextMessage += "Время начала : "+moment(savedata.date_start).format('DD.MM.YYYY HH:mm:ss')+"\n";
            sTextMessage += "Время завершения : "+moment(savedata.date_end).format('DD.MM.YYYY HH:mm:ss')+"\n"; 
            swal({
                title: "Проверка введенных данных",
                text: sTextMessage,
                icon: "info",
                buttons:["Исправить", "Сохранить"]
            })
              .then(function(willSave){
                if (willSave) {
                    saveSelectedFillData(savedata);
                }
            });
        }
    });

    $('#ctrlwindow').modal("show"); 

}

function saveSelectedFillData(data){
    let prdir = $('#prdir').text();
    $.ajax({
        type:'GET',
        // url: '../app/core/Routes.php/',
        url: '../'+prdir+'app/ajax/ajaxroutes.php/',
        data: { saveselfilldata: JSON.stringify(data) },
        cache: false,
        crossDomain: true,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(data){
            if(data.data == true){
                $('#ctrlwindow').modal("hide"); 
                swal("Сохранено", "Данные успешно сохранены", "success").
                then(function(res){
                    window.location.reload(); 
                });
            }
            else{
                swal("Ошибка", "Не могу сохранить данные.", "error");
            }
        },
        error: function(err){
            console.log(err);
        }
    });
}

function getSelector(selectedItem){
    let select = '<select class="form-control text-center" id="itembind">';
    for(let i = 0; i < bindArray.length; i++){
        if(i==selectedItem){
            select += '<option value="'+i+'" selected="selected">'+bindArray[i]+'</option>';
        }else{
            select += '<option value="'+i+'">'+bindArray[i]+'</option>';         
        }
    }
    select += '</select>'; 
    return select;
}

function getBindSelector(binddata, selectedItem, enabled){
    let select = "";
    if (enabled == true){
        select = '<select class="form-control text-center" id="itembind">';
    }
    else{
        select = '<select class="form-control text-center" id="itembind" disabled>';
    }
    for(let i = 0; i < binddata.length; i++){
        if(i==selectedItem){
            select += '<option value="'+i+'" selected="selected">'+binddata[i]+'</option>';
        }else{
            select += '<option value="'+i+'">'+binddata[i]+'</option>';         
        }
    }
    select += '</select>'; 
    return select;
}

function getOrgSelector(orgdata, selectedItem){
    let select = '<select class="form-control text-center" id="itemorg">';
    for(let i in orgdata){
        if(orgdata[i].id == selectedItem){
            select += '<option value="'+orgdata[i].id+'" selected="selected">'+orgdata[i].orgname+'</option>';
        }else{
            select += '<option value="'+orgdata[i].id+'">'+orgdata[i].orgname+'</option>';         
        }
    }
    select += '</select>'; 
    return select;
}

function getMvzSelector(mvzdata, selectedItem){
    let select = '<select class="form-control text-center" id="itemmvz">';
    for(let i in mvzdata){
        if(mvzdata[i].id == selectedItem){
            select += '<option value="'+mvzdata[i].id+'" selected="selected">'+mvzdata[i].id + " : " + mvzdata[i].desc+'</option>';
        }else{
            select += '<option value="'+mvzdata[i].id+'">'+mvzdata[i].id + " : " + mvzdata[i].desc+'</option>';         
        }
    }
    select += '</select>'; 
    return select;
}

function getSppSelector(sppdata, selectedItem){
    let select = '<select class="form-control text-center" id="itemspp">';
    for(let i in sppdata){
        if(sppdata[i].id == selectedItem){
            select += '<option value="'+sppdata[i].id+'" selected="selected">'+sppdata[i].desc+'</option>';
        }else{
            select += '<option value="'+sppdata[i].id+'">'+sppdata[i].desc+'</option>';         
        }
    }
    select += '</select>'; 
    return select;
}

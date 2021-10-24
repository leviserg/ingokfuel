class Svg {

// ================= page objects =================

    static setLevelObj(elem, obj){
        let barHeight = Math.round((obj.level / obj.maxlevel)*10)/10;
        let volPercent = Math.round((obj.vol / obj.maxvol)*10000)/100;
        let volShowPercent = Math.round((obj.vol / obj.maxvol)*1000)/10;
        let RoundDens = Math.round((obj.dens) * 10000) / 10000;
        this.setLevel('azs' + elem, barHeight);
        this.setSvgTitle('azs' + elem, obj.fulltitle + ' ('+ obj.fueltype + ') \n ');// + volPercent + '% объема\n' + moment(obj.date).format('DD.MM.YYYY HH:mm:ss'));  
        this.setSvgTitle('pazs' + elem, obj.fulltitle + ' ('+ obj.fueltype + ') \n ');// + volPercent + '% объема\n' + moment(obj.date).format('DD.MM.YYYY HH:mm:ss'));
        this.setText('stitle' + elem, obj.shorttitle);
        this.setText('ftype' + elem, obj.fueltype);
        this.setText('vol' + elem, obj.vol);
        this.setText('perc' + elem, volShowPercent);    
        this.setText('height' + elem, obj.level);    
        this.setText('temp' + elem, obj.temp);
        //this.setText('dens' + elem, obj.dens); 
        this.setText('dens' + elem, RoundDens); 
        this.setVisible('hp' + elem, obj.hi_prod_al);
        this.setVisible('lp' + elem, obj.low_prod_al);
        this.setVisible('hw' + elem, obj.hi_water_al);
        this.setVisible('alm' + elem, (obj.tank_status == 3));  
        let isIncome = (obj.delta > obj.dead_zone);
        this.setVisible('inc' + elem, isIncome); 
        let isOutcome = (obj.delta < (obj.dead_zone*-1));
        this.setVisible('outc' + elem, isOutcome);
    }

    static setMeterObj(elem, obj){
        this.setText(elem + 'vol', obj.vol);
        this.setText(elem + 'SumVol', obj.sumvol);
        this.setText(elem + 'summass', obj.summass);
        this.setText(elem + 'temp', obj.temp);
        this.setText(elem + 'dens', obj.dens);
        this.setText(elem + 'Vol', obj.vol);
        this.setText(elem + 'Date', moment(obj.date).format('DD.MM.YYYY HH:mm:ss'));
        this.setText(elem + 'Num', obj.trans);
        this.setText(elem + 'Daily', obj.dailyvol);
        let StatusText = '';
        let statusMask = {
            mehCtrl  : 0,
            minflow : 2,
            idnv   : 3,
            setpnv: 4,
            selfflow : 5,
            downloaded : 6,
            running : 7,
            stopped : 8,
            finished: 9
        };
        if(document.getElementById(elem + 'Status')!=null){
            if(obj.bitstatus!=0){
                this.setVisible(elem + 'Status', 1);
                if(this.getBit(obj.bitstatus,statusMask.finished)){
                    StatusText = 'ЗАВЕРШЕНО';
                }
                else{
                    /*
                    if(this.getBit(obj.bitstatus,statusMask.mehCtrl)){
                        StatusText += 'отс. к-роль мех';
                    }
                    */
                    if(this.getBit(obj.bitstatus,statusMask.downloaded)){
                        StatusText = 'ЗАГРУЖЕНО';
                    }
                    if(this.getBit(obj.bitstatus,statusMask.running)){
                        StatusText += '/ЗАПУЩЕНО';
                    }
                    if(this.getBit(obj.bitstatus,statusMask.minflow)){
                        StatusText += '/НЕТ_протока';
                    }
                    if(this.getBit(obj.bitstatus,statusMask.idnv)){
                        StatusText += '/отc.ID';
                    }
                    if(this.getBit(obj.bitstatus,statusMask.setpnv)){
                        StatusText += '/отc.ЗАД';
                    }
                    if(this.getBit(obj.bitstatus,statusMask.selfflow)){
                        StatusText += '/Самоход';
                    }
                }
                this.setText(elem + 'Status', StatusText);
            }
            else{
                this.setVisible(elem + 'Status', 0);
            } 
        } 
    }

    static setPumpObj(elem, obj){
        let statusMask = {
            almBit  : 2,
            warnBit : 1,
            onBit   : 0,
            maintBit: 15
        };
        this.setColor(elem, obj.status, statusMask.almBit, statusMask.warnBit, statusMask.onBit, statusMask.maintBit);
        let sTooltip = obj.title + '\n';
        //if(this.getBit(obj.status,statusMask.almBit))
        //    sTooltip += 'АВАРИЯ\n';
        //sTooltip += 'Время измен.сост.\n' +  moment(obj.lastdate).format('DD.MM.YYYY HH:mm:ss');
        this.setSvgTitle(elem, sTooltip);
    }

    static setPlcObj(elem, obj){
        this.setVisible(elem, obj.status);
    }


    // ================= colors & auxiliar =================

    static setCustTransportColor(elem, status){
        this.setColor(elem, status, 18, 18, 19, 20);
    }

    static setCustValveColor(elem, status){
        this.setValveColor(elem, status, 18, 0, 1, 20);
    }

    static setColor(elem, status, almbit, warnbit, onbit, maintbit){
        let colors = {
            red     : 'hsla(0, 100%, 63%, 1)',
            green   : 'hsla(119, 100%, 63%, 1)',
            yellow  : 'hsla(54, 100%, 71%, 1)',
            grey    : 'hsla(178, 0%, 72%, 1)',
            blue    : 'hsla(220, 100%, 65%, 1)'
        }
        if(this.getBit(status, almbit)){
            $('#' + elem).css('fill',colors.red);
            return;
        }
        else if(this.getBit(status, warnbit)){
            $('#' + elem).css('fill',colors.yellow);
            return;
        }
        else if(this.getBit(status, onbit)){
            $('#' + elem).css('fill',colors.green);
            return;
        }
        else if(this.getBit(status, maintbit)){
            $('#' + elem).css('fill',colors.blue);
            return;        
        }
        else{
            $('#' + elem).css('fill',colors.grey);
        }
    }

    static setValveColor(elem, status, almbit, onbit, offbit, maintbit){
        let colors = {
            red     : 'hsla(0, 100%, 63%, 1)',
            green   : 'hsla(119, 100%, 63%, 1)',
            yellow  : 'hsla(54, 100%, 71%, 1)',
            grey    : 'hsla(178, 0%, 72%, 1)',
            blue    : 'hsla(220, 100%, 65%, 1)'
        }
        if(this.getBit(status, almbit)){
            $('#' + elem).css('fill',colors.red);
            return;
        }
        else if(this.getBit(status, onbit)){
            $('#' + elem).css('fill',colors.green);
            return;
        }
        else if(this.getBit(status, offbit)){
            $('#' + elem).css('fill',colors.grey);
            return;
        }
        else if(this.getBit(status, maintbit)){
            $('#' + elem).css('fill',colors.grey);
            return;
        }
        else{
            $('#' + elem).css('fill',colors.yellow);
        }
    }

    static getBit(statusword, bit){
        return ((parseInt(statusword) & Math.pow(2,bit))!=0) ? true : false;
    }

    static setLevel(elem, val){
        $('#' + elem).css('height', parseInt(parseFloat($('#p' + elem).css('height')) * (1 - val)));
        //setAttribute('viewbox', '0 0 ' + w + ' ' + h);
        //$('#' + elem).setAttribute('height', parseInt(parseFloat($('#p' + elem).css('height')) * (1 - val)));
        //console.log($('#' + elem).css('height'));//.replace('px', ''););
    }

    static setSvgTitle(elem, text) {
        var titleElem = document.createElementNS("http://www.w3.org/2000/svg","title");
        titleElem.textContent = text;
        if(document.getElementById(elem) !== null ){
            document.getElementById(elem).appendChild(titleElem);
        }
        
    }

    static setText(elem, text){
        if($('#'+elem).length){
            let SrcLength = $('#'+elem+' tspan').text().length;
            let TextLength = text.toString().length;
            let shift = SrcLength - TextLength;
            let strBuild = '';
            for(let i = 0; i < shift; i++){
                strBuild += ' ';
            }
            strBuild += text;
            $('#'+elem+' tspan').text(strBuild);
        }
    }

    static setVisible(elem, visible){
        (visible != 0) ? $('#'+elem).css('display','block') : $('#'+elem).css('display','none');
    }
    
    
}
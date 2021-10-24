<?php   if ($_SESSION['user']['department']==0): ?>
    <div class="mt-2">
        <div class="row py-2">
            <div class="col-md-11 text-center pr-4" style="display:none">
                <span class="text-info align-middle mr-3" id="shprdt">Отображать данные</span>
                <div class="btn-group btn-group-justify" role="group" aria-label="no">
                    <button type="button" class="btn btn-outline-info" style="width: 160px" id="shprd">Предыдущие</button>
                    <button type="button" class="btn btn-info" style="width: 160px" id="shcrd">Текущие</button>
                </div>
            </div>
        </div>
        <div class="container-fluid mt-2" id="content">
            <div class="row">
                <div class="col-md-12" style="width:100%">
                    <?php require "mnemos/stations.php" ?>
                </div>
            </div>
        </div>
    </div>
    <?php 
        require "modals/ctrlwindow.php";
        require "modals/leveltrendwindow.php";
        require "modals/fillpointwindow.php";    
    ?>

    <script src="public/js/develop/homescripts.js"></script>
<?php else: ?>
    <h1 style="text-align: center; margin-top:200px" class="text-info">Доступ запрещен</h1><br/>
    <p style="text-align: center" class="text-info"><b>Вы пытаетесь зайти на закрытую для просмотра страницу</b></p>
    <!-- <p style="text-align: center"></p> -->
<?php endif ?>
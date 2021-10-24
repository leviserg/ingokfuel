<?php   if ($_SESSION['user']['department']==0 || $_SESSION['user']['department']==3): ?>
    <div class="mt-2">
        <div class="container-fluid mt-2" id="content">
            <div class="row">
                <div class="col-md-3 pr-3" style="width:100%">
                    <?php require "mnemos/localotv.php" ?>
                    <div class="row mt-2">
                        <div class="col-md-12 text-right ml-auto mr-0">
                            <button class="btn btn-sm btn-success  mx-2 px-2 addfill" id="FOtv" data-toggle="tooltip" title="Заполнить форму налива вручную" style="width:30%">Добавить данные</button>
                            <button class="btn btn-sm btn-info mx-2 px-2 monreport" id="mFOtv" data-toggle="tooltip" title="Создать суммарный отчет (н-р: за месяц)" style="width:30%">Суммарный отчет</button>
                            <button class="btn btn-sm btn-info" id="addreport" data-toggle="tooltip" title="Создать отчет по наливам" style="width:30%">Создать отчет</button>
                        </div>
                    </div>
                </div>
                <div class="col-md-9" style="width:100%">
                    <div class="row mt-2">
                        <div class="col-md-12" style="width:100%; height:auto" id="localotvtablecontent">
                        </div>
                    </div>                                  
                </div>
            </div>
        </div>
    </div>

    <?php 
        require "modals/ctrlwindow.php";
        require "modals/leveltrendwindow.php";
        require "modals/fillpointwindow.php";
    ?>

    <script src="public/js/develop/localotvscripts.js"></script>
<?php else: ?>
    <h1 style="text-align: center; margin-top:200px" class="text-info">Доступ запрещен</h1><br/>
    <p style="text-align: center" class="text-info"><b>Вы пытаетесь зайти на закрытую для просмотра страницу</b></p>
    <!-- <p style="text-align: center"></p> -->
<?php endif ?>
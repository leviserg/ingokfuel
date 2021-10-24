<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta http-equiv="cache-control" content="no-cache">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Контроль топлива</title>
    <!-- Styles -->
    <!-- <link href="public/css/app.css" rel="stylesheet"> -->
    <link href="public/css/datatable.css" rel="stylesheet">
    <link href="public/css/sort.css" rel="stylesheet">
    <link href="public/css/bootstrap.css" rel="stylesheet">
    <link href="public/css/font-awesome.css" rel="stylesheet">
    <link href="public/css/favicon.ico" rel="shortcut icon">
    <link href="public/amcharts/style.css" rel="stylesheet">
    <link href="public/amcharts/export.css" rel="stylesheet">
    <link href="public/css/appstyles.css" rel="stylesheet">
    <!-- Scripts -->
    <!-- <script src="https://unpkg.com/@babel/standalone/babel.min.js" type="text/babel"></script> -->
    <!-- Your custom script here -->
    <script src="public/js/source/html5shiv.js"></script>
    <script src="public/js/source/response.js"></script>
</head>
<body>
    <nav class="navbar navbar-expand-md bg-info navbar-dark">
        <?php if (isset($_SESSION['user']) && isset($_SESSION['user']['department'])): ?>
            <a class="navbar-brand" href="home" data-toggle="tooltip" title="Домой"><i class="fa fa-home mx-2"></i></a>
        <?php endif; ?> 
        <button class="navbar-toggler navbar-toggler-right" type="button"
            data-toggle="collapse" data-target="#navbarResponsive"
            aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
            <i class="fa fa-bars"></i>
        </button>
        <span id="prdir" style="display:none"><?php echo require "config/prdir.php"?></span>
        <div class="collapse navbar-collapse justify-content-between" id="navbarResponsive">
            <ul class="navbar-nav">
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="cursor:pointer">
                        <i class="fa fa-cubes mx-2"></i><span id="pagetitle">Участки</span>
                    </a>
                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <a class="dropdown-item text-info" href="localstore"><i class="fa fa-cube mx-2"></i>Склад ГСМ</a>
                        <a class="dropdown-item text-info" href="localazs"><i class="fa fa-cube mx-2"></i>АЗС АТЦ</a>
                        <a class="dropdown-item text-info" href="localotv"><i class="fa fa-cube mx-2"></i>ГСМ ЖДЦ Отвальная</a>
                        <a class="dropdown-item text-info" href="localprom"><i class="fa fa-cube mx-2"></i>ГСМ ЖДЦ Промышл-я</a>
                    </div>
                </li>
                <li class="nav-item">
                    <a class="nav-link mx-2 px-2" href="alarms" data-toggle="tooltip" title="Аварии"><i class="fa fa-bell mx-2"></i>Аварии</a>
                </li>
                <?php  if (isset($_SESSION['user']) && isset($_SESSION['user']['department'])): ?>
                    <li class="nav-item">
                        <a class="nav-link mx-2 px-2" href="events" data-toggle="tooltip" title="События"><i class="fa fa-list mx-2"></i>События</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link mx-2 px-2" href="trends" data-toggle="tooltip" title="Графики параметров резервуаров"><i class="fa fa-bar-chart mx-2"></i>Тренды</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link mx-2 px-2" href="driverlist" data-toggle="tooltip" title="Справочники ТС и участков"><i class="fa fa-address-book mx-2"></i>Справочники</a>
                    </li>
                <?php endif; ?> 
                <?php if (isset($_SESSION['user']) && isset($_SESSION['user']['adm'])): ?>
                    <?php if ($_SESSION['user']['adm'] == 1 ): ?>
                        <li class="nav-item">
                            <a class="nav-link mx-2 px-2" href="reports" data-toggle="tooltip" title="Файлы сут. отчетов для Medoc"><i class="fa fa-files-o mx-2"></i>Отчеты</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link mx-2 px-2" href="userhist" data-toggle="tooltip" title="История входа пользователей"><i class="fa fa-tasks mx-2"></i>Статистика</a>
                        </li>
                    <?php endif; ?>                      
                <?php endif; ?>                       
            </ul>

            <ul class="navbar-nav ml-auto mr-auto">
                <li class="nav-item">
                    <a class="text-white font-weight-bold" id="lineName"></a>
                </li> 
            </ul>
            <ul class="navbar-nav ml-auto">
                <?php if (!isset($_SESSION['user']) || count($_SESSION['user'])==0): ?>
                    <li class="nav-item">
                        <a class="nav-link mr-2" href="login" id="loginbtn" data-toggle="tooltip" title="Вход в систему">Вход</a>
                    </li>
                    <p id="session" style="display:none">0</p>
                <?php else: ?>
                    <li class="nav-item">
                        <span class="nav-link">Вы: <?php echo $_SESSION['user']['login']?></span>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="logout" id="logoutnbtn" data-toggle="tooltip" title="Выйти из системы">Выход</a>
                    </li>
                    <span id="useradm" style="display:none"><?php echo $_SESSION['user']['adm']?></span>
                    <span id="userrecid" style="display:none"><?php echo $_SESSION['user']['rec_id']?></span>
                    <span id="userid" style="display:none"><?php echo $_SESSION['user']['id']?></span>
                    <span id="enctrl" style="display:none"><?php echo $_SESSION['user']['enctrl']?></span>
                    <span id="department" style="display:none"><?php echo $_SESSION['user']['department']?></span>
                <?php endif; ?>
                <li class="nav-item active">
                    <span class="nav-link" id="curtime"></span>
                </li>
            </ul>
        </div>
    </nav>
    <div class="container-fluid" style="width:100%">

        <script src="public/js/source/jquery.js"></script>
        <script src="public/js/source/jquery.xdomainrequest.min.js"></script>
        <script src="public/js/source/popper.js"></script>
        <script src="public/js/source/bootstrap.js"></script>
        <script src="public/js/source/sweetalert.js"></script>
        <script src="public/js/source/moment.js"></script>
        <script src="public/js/source/datatable.js"></script>
        <script src="public/js/source/datatablebuttons.js"></script>
        <script src="public/js/source/jszip.js"></script>
        <script src="public/js/source/datatablehtml5buttons.js"></script>
        <script src="public/js/source/jlinq.js"></script>
        <script src="public/js/source/d3.js"></script>

        <script src="public/amcharts/amcharts.js"></script>
        <script src="public/amcharts/serial.js"></script>
        <script src="public/amcharts/amstock.js"></script>
        <script src="public/amcharts/export.js"></script>
        <?php
            if (!isset($_SESSION['user']) || count($_SESSION['user'])==0)
                require "app/views/login.php";
            else
                echo $content;
        ?>
    </div>
    <div class="bg-info almstrip">
        <p>Активных аварий
            <a class="text-white pl-2" href="alarms">
                <b><span id="actsum">...</span></b>
            </a>
            <span class="text-white-50 text-right" id="contactlink" style="position:fixed; right:1%"><small>&copy; Tech Support</small></span>
        </p>
    </div>

    <a href="#" class="scrollup"></a>

    <div class="mt-5 modal fade modal-fade" id="showhist" tabindex="2">
        <div class="modal-dialog modal-sm">
            <div class="modal-content">
                <div class="modal-header mb-0 mt-0">
                    <h5 class="modal-title">Дата и время</h5>
                    <button class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="container">
                        <div class="form-group">
                            <label for="dpicker" class="small">Выберите дату:</label>
                            <input class="form-control mx-2 text-center" type="text" id="dpicker" placeholder="гггг-мм-дд" maxlength="10"/>
                        </div>
                        <div class="form-group mt-1">
                            <label for="tpicker" class="small">Укажите время:</label>
                            <input class="form-control mx-2 text-center" type="text" id="tpicker" placeholder="чч:мм:сс" maxlength="8"/>
                        </div>
                        <hr/>
                        <input class="btn btn-info mt-1 mb-2 ml-2" id="goto" style="width:45%" type="button" value="Перейти">
                        <button class="btn btn-outline-info mt-1 mb-2 ml-2" style="width:45%" type="button" data-dismiss="modal" aria-label="Close">Закрыть</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="mt-5 modal fade modal-fade" id="repdates" tabindex="2">
        <div class="modal-dialog modal-md">
            <div class="modal-content">
                <div class="modal-header mb-0 mt-0">
                    <h5 class="modal-title">Дата и время</h5>
                    <button class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="container">
                        <div class="form-group row">
                            <label for="dstpicker" class="col-sm-6 small">Выберите дату (начало):</label>
                            <input class="form-control col-sm-5 mx-2 text-center" type="text" id="dstpicker" placeholder="гггг-мм-дд" maxlength="10"/>
                        </div>
                        <div class="form-group row mt-1">
                            <label for="tstpicker" class="col-sm-6 small">Укажите время (начало):</label>
                            <input class="form-control col-sm-5 mx-2 text-center" type="text" id="tstpicker" placeholder="чч:мм:сс" maxlength="8"/>
                        </div>
                        <hr/>
                        <div class="form-group row mt-1">
                            <label for="dfnpicker" class="col-sm-6 small">Выберите дату (конец):</label>
                            <input class="form-control col-sm-5 mx-2 text-center" type="text" id="dfnpicker" placeholder="гггг-мм-дд" maxlength="10"/>
                        </div>
                        <div class="form-group row mt-1">
                            <label for="tfnpicker" class="col-sm-6 small">Укажите время (конец):</label>
                            <input class="form-control col-sm-5 mx-2 text-center" type="text" id="tfnpicker" placeholder="чч:мм:сс" maxlength="8"/>
                        </div>
                        <hr/>
                        <input class="btn btn-info mt-1 mb-2 ml-2" id="getrep" style="width:45%" type="button" value="Перейти">
                        <button class="btn btn-outline-info mt-1 mb-2 ml-2" style="width:45%" type="button" data-dismiss="modal" aria-label="Close">Закрыть</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <div class="mt-5 modal fade modal-fade" id="contact" tabindex="2">
        <div class="modal-dialog modal-md" style="position:fixed; bottom:5%; right:5%; margin:0px;">
            <div class="modal-content">
                <div class="modal-header mb-0 mt-0">
                    <h5 class="modal-title">Поддержка</h5>
                    <button class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="container">
                        <form method="post" id="contactForm">
                            <div class="control-group">
                                <div class="form-group floating-label-form-group controls">
                                    <p><input type="text" class="form-control" name="name" id="name" placeholder="Как к Вам обращаться?"></p>
                                </div>
                            </div>
                            <div class="control-group">
                                <div class="form-group floating-label-form-group controls">
                                    <p><input type="email" class="form-control" name="email" id="email" placeholder="Ваш e-mail для связи"></p>
                                </div>
                            </div>
                            <div class="control-group">
                                <div class="form-group floating-label-form-group controls">
                                    <p><textarea rows="5" class="form-control" name="text" id="text" placeholder="Введите Ваше сообщение..."></textarea></p>
                                </div>
                            </div>
                            <br>
                            <div id="success"></div>
                            <div class="form-group">
                                <button type="submit" class="btn btn-info ml-2" style="width:45%" id="sendMessageButton">Отправить</button>
                                <button type="button" class="btn btn-outline-info ml-2" style="width:45%" data-dismiss="modal" aria-label="Close">Закрыть</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script src="public/js/develop/svgclass.js"></script>
    <script src="public/js/develop/trendsmodal.js"></script>
    <script src="public/js/develop/appscripts.js"></script>
    <script src="public/js/develop/tablescripts.js"></script>
    <script src="public/js/develop/excelreports.js"></script>
</body>
</html>
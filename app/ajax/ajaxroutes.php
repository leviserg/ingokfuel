<?php
    namespace app\core;

use ExcelReport;

require '../core/Db.php';

    $ret = [];

    $filename = '../core/models/CurData.php';
    if(isset($_GET['homecurdata']))   {  require $filename;                         $ret = CurData::getCurData(); } // for svg graphics
    if(isset($_GET['elemid']) && isset($_GET['elemtype'])){ require $filename;      $ret = CurData::getCurElemData($_GET['elemid'], $_GET['elemtype']); } // for modal window {current state}
    if(isset($_GET['fillpoint'])){ require $filename;                               $ret = CurData::getLocalFillTable($_GET['fillpoint']); } // for meter modal window
    if(isset($_GET['tankid'])){ require $filename;                                  $ret = CurData::getLocalLevelTrends($_GET['tankid']); } // // for tank modal window
    if(isset($_GET['points'])){ require $filename;                                  $ret = CurData::getFillPointsDataTable($_GET['points']); } // all points on page
    if(isset($_GET['resetpump']) && isset($_GET['command'])){ require $filename;    $ret = CurData::setPumpCommand($_GET['resetpump'],$_GET['command']); } // update command in pumps table - restart task
    if(isset($_GET['getdeadzones'])){ require $filename;                            $ret = CurData::getDeadZones(); }
    if(isset($_GET['setzonesdata'])){ require $filename;                            $ret = CurData::setDeadZones($_GET['setzonesdata']); }

    $filename = '../core/models/TaskData.php';
    if(isset($_GET['checklasttaskstatus'])){ require $filename;                     $ret = TaskData::getLastTaskData(); } // last task control - for control buttons state - F1 + F2 only {local store}
    if(isset($_GET['point']) && isset($_GET['newtask'])){ require $filename;        $ret = TaskData::getDestinationsForNewTask($_GET['point']); }
    if(isset($_GET['drive']) && isset($_GET['newtask'])){ require $filename;        $ret = TaskData::getTransportsForNewTask($_GET['drive']); }
    if(isset($_GET['newtaskdata']) && isset($_GET['newtask'])){ require $filename;  $ret = TaskData::insert($_GET['newtaskdata']); }
    if(isset($_GET['meterid'])){ require $filename;                                 $ret = TaskData::closeTask($_GET['meterid'], $_GET['manstop']); }
    if(isset($_GET['savenewfilldata'])){ require $filename;                         $ret = TaskData::saveNewFillData($_GET['savenewfilldata']); }
    if(isset($_GET['updsetp'])){ require $filename;                                 $ret = TaskData::updateSetpoint($_GET['plc_n'], $_GET['setpoint']); }
    if(isset($_GET['fillid'])) { require $filename;                                 $ret = TaskData::getSingleFill($_GET['fillid']); } 
    if(isset($_GET['saveselfilldata'])) { require $filename;                        $ret = TaskData::setSingleFill($_GET['saveselfilldata']); } 

    $filename = '../core/models/UserData.php';
    if(isset($_GET['usershist']))     { require $filename;   $ret = UserData::getUserHistory(); }

    $filename = '../core/models/Destination.php';
    if(isset($_GET['destinations']))  { require $filename;   $ret = Destination::selectAll(); }
    if(isset($_GET['destination']))   { require $filename;   $ret = Destination::selectOne($_GET['destination']); }
    if(isset($_GET['destdata']))      { require $filename;   $ret = Destination::update($_GET['destdata']); }
    if(isset($_GET['newdestdata']))   { require $filename;   $ret = Destination::insert($_GET['newdestdata']); }

    $filename = '../core/models/Transport.php';
    if(isset($_GET['newtranspdata'])) { require $filename;   $ret = Transport::insert($_GET['newtranspdata']); } 
    if(isset($_GET['transports']))    { require $filename;   $ret = Transport::selectAll($_GET['transports']); } 
    if(isset($_GET['transport']))     { require $filename;   $ret = Transport::selectOne($_GET['transport']); }
    if(isset($_GET['updtransport']))  { require $filename;   $ret = Transport::update($_GET['updtransport']); } 
    if(isset($_GET['getorgs']))       { require $filename;   $ret = Transport::getOrgMvzSpp(); } 
    if(isset($_GET['fillunit']))      { require $filename;   $ret = Transport::selectNums($_GET['fillunit']); }     

    $filename = '../core/models/AlarmData.php';
    if(isset($_GET['almcount']))     { require $filename;    $ret = AlarmData::almcount(); }
    if(isset($_GET['getalarms']))     { require $filename;   $ret = AlarmData::getAlarms(); }
    if(isset($_GET['getalarmhist']))  { require $filename;   $ret = AlarmData::getAlarmHist(); }
    if(isset($_GET['getactalarms']))  { require $filename;   $ret = AlarmData::getActAlarms(); }

    $filename = '../core/models/ExcelReport.php';    
    if(isset($_GET['getreportdata']))  { require $filename;   $ret = ExcelReport::createReport(($_GET['getreportdata'])); }
    if(isset($_GET['getmonthreport']))  { require $filename;   $ret = ExcelReport::createMonthReport(($_GET['getmonthreport'])); }

    if(!empty($_POST)){
        require '../core/models/MailOp.php';
        $ret = MailOp::messageSend($_POST);
    }

    echo json_encode(["data"=>$ret]);
    
?>
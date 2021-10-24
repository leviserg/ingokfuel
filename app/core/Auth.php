<?php
    namespace app\core;
    require 'Db.php';
    require 'models/UserData.php';
    $prdir = require '../config/prdir.php';
    session_start();
    $authdata = UserData::getusers();

    if(!empty($_POST)){
        $postdata = [
            'login' => strval($_POST['login']),
            'password' => md5(strval($_POST['pwd']))
        ];
        foreach ($authdata as $account) {
            if($postdata['login']==$account['login'] && $postdata['password']==$account['password']){
                $rec_id = UserData::loginrecord($account['id']);
                if(!is_null($rec_id)){
                    $_SESSION['user'] = [
                        'id'            =>  intval($account['id']),
                        'login'         =>  $account['login'],
                        'adm'           =>  intval($account['adm']),
                        'enctrl'        =>  intval($account['enctrl']),
                        'rec_id'        =>  intval($rec_id),
                        'department'    => intval($account['department'])
                    ];
                    if(intval($account['department']) == 1){
                        $url = 'localstore';
                    }
                    elseif(intval($account['department']) == 2){
                        $url = 'localazs';
                    }
                    elseif(intval($account['department']) == 3){
                        $url = 'localotv';
                    }
                    else{
                        $url = 'home';
                    }
                    header('location: /'.$prdir.$url);
                    die();
                }
                else{
                    unset($_SESSION['user']);
                    die('Cannot insert record. Please try again');
                }
            }
        }
        $_SESSION['user'] = [];
        $url = 'login';
        header('location: /'.$prdir.$url);
        die();
    }
    exit;
?>
<?php 
    namespace app\core;
	require 'app/core/models/UserData.php';
	session_destroy();
	if(isset($_SESSION['user']) && count($_SESSION['user'])!=0){
		if(UserData::logoutrecord($_SESSION['user']['rec_id'])){
			unset($_SESSION['user']);
		}
		else{
			die('Cannot update record');
		}
	}
	echo require 'login.php';
?>

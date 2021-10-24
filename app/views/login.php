<br/>
<div class="row mr-auto ml-auto d-flex justify-content-center">
		<div style="width:400px; margin-top:10%">
			<div class="card card-login">
				<div class="card-header">Вход в систему</div>
				<div class="card-body">
                    <?php
                        if(strlen($vars['wr'])!=0)
                            echo '<p class="text-danger">'.$vars['wr'].'</p>';
                    ?>
					<form action="app/core/Auth.php" method="post">
						<div class="form-group">
							<label for="name">Логин</label>
							<input class="form-control text-center" type="text" name="login" id="name">
						</div>
						<div class="form-group">
							<label for="pwd">Пароль</label>
							<input class="form-control text-center" type="password" name="pwd" id="pwd">
						</div>
						<button type="submit" class="btn btn-info btn-block">Войти</button>
						<hr/>
					</form>
					<!-- <a class="btn btn-success btn-block" href="home">Назад</a> -->
					<!--
					<ul class="mt-4 small font-italic text-muted">
						<li><small>Пароль пользователя такой же, как и логин (пока)</small></li>
						<small>------------------------</small>
						<li><small>user</small></li>
						<li><small>opercpp</small></li>
						<li><small>operazs</small></li>
					</ul>
					-->
				</div>
			</div>
		</div>
</div>
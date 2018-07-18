btn.onclick = function (){
	alert('需求完成')		
}

$('#getUsers').click(function (){
	$.ajax({
		url: '/users',
		success(data){
			console.log(data);
		}
	})
})
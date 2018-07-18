// 前端的代码，发送ajax的
$('#getUsers').click(function (){
	$.ajax({
		url: '/miaov/miaov-jiangshi',
		method: 'get',
		data:{
			m: $('#search').val().trim()
		},
		success(data){
			console.log(data);
		}
	})
})
/*$('#getUsers').click(function (){
	$.ajax({
		url: '/one-movie',
		data:{
			m: $('#search').val().trim()
		},
		success(data){
			console.log(data);
		}
	})
})*/
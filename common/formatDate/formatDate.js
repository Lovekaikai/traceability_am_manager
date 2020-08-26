//  封装 时间格式化

export default (time) => {
	var date = new Date(time);
	var year = date.getFullYear();
	var mouth = date.getMonth() + 1;
	var day = date.getDate();
	
	mouth = mouth < 10 ? '0' + mouth : mouth;
	day = day < 10 ? '0' + day : day;
	
	return year + '/' + mouth + '/' + day;
}


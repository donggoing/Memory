const fs = require("fs");
const path = require('path');

function read() {
	return new Promise((resolve,reject)=>{
		fs.readFile(path.join(__dirname,'../public/records.json'), function(err, data) {
			if (err) {
				console.error(err);
				reject(err);
			}
			data = JSON.parse(data.toString());
			check(data);
			// console.log("loading file: records.json ");
			resolve(data);
		});
	})
}

function readSync(src) {
	var data = fs.readFileSync(src);
	return data.toString();
}

function update(index, description) {
	return read().then((records)=>{
		if(index>=records.current)
			return Promise.reject("Out of bounds");
		else{
			records["images_words"][index]=description;
			const str = JSON.stringify(records);
			write(path.join(__dirname,'../public/records.json'),str);
			return Promise.resolve();
		}
	})
}

function write(src, content) {
	return fs.writeFile(src, content, function(err) {
		if (err) {
			console.error(err);
			return Promise.reject(err);
		}
		console.log('----------写入成功-------------');
		return Promise.resolve();
		// console.log("writed file：" + src + " content: " + content);
	});
}

// function append(src, content) {
// 	fs.appendFile(src, content, function(err) {
// 		if (err) {
// 			return console.error(err);
// 		}
// 		console.log("writed file：" + src + " content: " + content);
// 	});
// }

function readPropertiesSync(src) {
	var data = readSync(src);
    var obj = new Object();
	data.split("\n").map(function (i) {
		//跳过注释
		if (i.indexOf("#") == -1) {
			var temp = i.split("=");
			if (temp.length == 2) {
				obj[temp[0]] = temp[1];
			}
		}
	});
	return obj;
}

function append(newImage){
    //现将json文件读出来
    return read().then((records)=>{
		// var records = data.toString();//将二进制的数据转换为字符串
		check(records);
		records['current']++;
		records['total']++;
		records['images_index'].push(records['current']-1);
		records['images_name'].push(newImage['name']);
		records['images_originName'].push(newImage['originName']);
		records['images_words'].push(newImage['words']);
		records['images_time'].push(new Date().toLocaleDateString());
		console.log(`current:${records['current']}, total:${records['total']}`);
		const str = JSON.stringify(records);//因为nodejs的写入文件只认识字符串或者二进制数，所以把json对象转换成字符串重新写入json文件中
		return write(path.join(__dirname,'../public/records.json'),str);
    })
}

function check(records){
	if(!records['images_index']) records['images_index'] = [];
	if(!records['images_time']) records['images_time'] = [];
	if(!records['images_originName']) records['images_originName'] = [];
	if(!records['images_name']) records['images_name'] =  [];
	if(!records['images_words']) records['images_words'] = [];
	records['current'] = records['current'] ? records['current'] : 0;
	records['total'] = records['total'] ? records['total'] : 0;
	
}

exports.read = read;
exports.update = update;
exports.write = write;
exports.append = append;
exports.readPropertiesSync = readPropertiesSync;
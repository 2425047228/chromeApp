"use strict";
window.onload = function () {
    var param = core.paramToObject();
    UI.createCrumbs([
        ['订单处理', './manage.html'],
        ['待清洗', './willClean.html'],
        ['衣物检查', '#']
    ]);
    core.byId('next').onclick = function () {
        return location.href = './willClean.html';
    }
    var token,data;
    core.storage.get('token',function (result) {
        token = result.token;
        core.post(api.getUrl('check'),{token:token,id:param.id},function (json) {
            var jsonData = core.jsonParse(json);
            data = jsonData.data;
            dataView(data);
            console.log(jsonData);
        })
    })

    function dataView(data) {
        var len = data.length;
        if (len < 1) return false;
        var tempNode, tempLen, j, colorEditor = [],questionEditor = [],imgNode = [], node = [];
        for (var i = 0;i < len;++i) {
            tempNode = node[i] = UI.createNodes('div',14);
            //主容器节点
            tempNode[0].className = 'container';
            //标题节点
            tempNode[1].className = 'clearfix bg-container';    //标题背景节点
            tempNode[0].appendChild(tempNode[1]);
            tempNode[2].className = 'left';    //左侧标题节点
            tempNode[2].innerText = data[i].g_name;
            tempNode[1].appendChild(tempNode[2]);
            tempNode[3].className = 'right';    //右侧数量节点
            tempNode[3].innerHTML = '数量：×<span>'+data[i].number+'</span>';
            //照片容器节点
            tempNode[4].className = 'flex-container';
            tempNode[0].appendChild(tempNode[4]);
            //照片提示节点
            tempNode[5].className = 'flex-item';
            tempNode[5].innerText = '上传照片:';
            tempNode[4].appendChild(tempNode[5]);
            //照片节点
            tempLen = data[i].img.length;
            if (tempLen > 0) {
                imgNode[i] = [];
                for (j = 0;j < tempLen;++j) {
                    imgNode[i][j] = {
                        container:core.e('div'),
                        image:core.e('img')
                    };
                    imgNode[i][j].container.className = 'flex-item';
                    imgNode[i][j].image.style.width = imgNode[i][j].image.style.height = 'inherit';
                    createDelNode(imgNode[i][j].container,data[i].img[j],data[i].id);
                    imgNode[i][j].container.appendChild(imgNode[i][j].image);
                    tempNode[4].appendChild(imgNode[i][j].container);    //照片节点追加至照片容器节点中
                    core.getImage(api.host + data[i].img[j],imgNode[i][j].image);
                }
            }
            //照片上传节点
            tempNode[6].className = 'flex-item upload-img';
            tempNode[6].setAttribute('data-id',data[i].id);
            tempNode[4].appendChild(tempNode[6]);
            tempNode[6].onclick = function () {    //判断nodes少于14
                var that = this;
                var itemId = that.getAttribute('data-id');
                var container = that.parentNode;
                var imageNodes = container.childNodes;
                var imageNumber = (imageNodes.length - 3);
                if (imageNumber >= 11) return false;
                core.chooseImage(function (Entry) {
                    var fileEntries = Entry.fileEntries;
                    if (typeof fileEntries !== "undefined") {
                        var len = fileEntries.length;
                        for (var i = 0;i < len;++i) {
                            if (imageNumber >= 11) break;
                            fileEntries[i].file(function (file) {
                                var item = core.e('div'),image = new Image();     //创建图片及容器
                                item.className = 'flex-item';
                                image.style.width = image.style.height = 'inherit';
                                item.appendChild(image);
                                container.insertBefore(item,that);    //照片节点追加至照片容器节点中
                                var reader = new FileReader();
                                reader.onload = function () {
                                    image.src = this.result;
                                    core.postFormData(
                                        api.getUrl('checkImageUpload'),
                                        {
                                            token:token,
                                            orderid:param.id,
                                            id:itemId,
                                            file:{
                                                file:this.result.base64toBlob(),
                                                name:'i.png'
                                            }
                                        },
                                        function (json) {
                                            var data = json.parseJson(true);
                                            if (typeof data[0] === "string") {createDelNode(item,data[0],itemId);}
                                        }
                                    );
                                };
                                reader.readAsDataURL(file);
                            });
                            ++imageNumber;
                        }
                    }
                });
            };
            //提示照片数量限制节点
            tempNode[7].className = 'flex-item flex-item-last';
            tempNode[7].innerHTML = '<div class="text-bottom">（上传照片不得超过11张）</div>';
            tempNode[4].appendChild(tempNode[7]);
            //颜色容器节点
            tempNode[8].className = 'page-info';
            tempNode[0].appendChild(tempNode[8]);
            //颜色提示节点
            tempNode[9].innerText = '颜色:';
            tempNode[8].appendChild(tempNode[9]);
            //颜色数据节点
            tempNode[10].innerText = data[i].color;
            tempNode[8].appendChild(tempNode[10]);
            //问题容器节点
            tempNode[11].className = 'page-info';
            tempNode[0].appendChild(tempNode[11]);
            //问题提示节点
            tempNode[12].innerText = '问题描述:';
            tempNode[11].appendChild(tempNode[12]);
            //问题数据节点
            tempNode[13].innerText = data[i].item_note;
            tempNode[11].appendChild(tempNode[13]);
            //颜色编辑及问题编辑按钮节点
            colorEditor[i] = core.e('input');
            tempNode[8].appendChild(colorEditor[i]);
            questionEditor[i] = core.e('input');
            tempNode[11].appendChild(questionEditor[i]);
            colorEditor[i].setAttribute('type','button');
            colorEditor[i].setAttribute('data-id',data[i].id);
            colorEditor[i].setAttribute('data-color',data[i].color);
            questionEditor[i].setAttribute('data-id',data[i].id);
            questionEditor[i].setAttribute('data-question',data[i].item_note);
            questionEditor[i].setAttribute('type','button');
            colorEditor[i].className = questionEditor[i].className = 'btn btn-editor';
            colorEditor[i].value = questionEditor[i].value = '编辑';
            core.byId('body').appendChild(tempNode[0]);
            colorEditor[i].onclick = function () {
                return location.href = './color.html?id=' + param.id + '&item_id=' + this.dataset.id +
                    '&color=' + encodeURIComponent(this.dataset.color);
            }
            questionEditor[i].onclick = function () {
                return location.href = './question.html?id=' + param.id + '&item_id=' + this.dataset.id +
                    '&question=' + encodeURIComponent(this.dataset.question);
            }
        }
    }

    function delImageItem(delNode) {
        var container = delNode.parentNode;
        core.post(
            api.getUrl('deleteImage'),
            {token:token,image:delNode.dataset.path,orderid:param.id,id:delNode.dataset.id},
            function (json) {
                if (core.apiVerify(json.parseJson())) {
                    container.parentNode.removeChild(container);    //操作成功删除该节点
                }
            }
        );
    }
    function createDelNode(container,path,id) {
        var delImage = core.e('em');
        delImage.className = 'upload-img-delete';
        delImage.setAttribute('data-path',path);
        delImage.setAttribute('data-id',id);
        container.appendChild(delImage);
        delImage.onclick = function () {delImageItem(this);}
    }
}

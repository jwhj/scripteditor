var cm
const editor={
	template:'#editorTpl',
	props:['value'],
	methods:{
	},
	mounted(){
		cm=this.cm=CodeMirror.fromTextArea(document.getElementById('blabla'),{
			lineNumbers:true,
			theme:'monokai',
			mode:'javascript'
		})
		this.cm.on('change',()=>{
			this.value=this.cm.getValue()
			this.$emit('input',this.value)
		})
	}
}
Vue.component('editor',editor)
const vm=new Vue({
	el:'#app',
	data:{
		code:'',
		id:'fsd',
		lang:'javascript',
		showMenu:false,
		fileCnt:0,
		fileList:[]
	},
	methods:{
		run(){
			const req={
				lang:this.lang,
				code:this.code
			}
			this.sandBox.postMessage(JSON.stringify(req),'*')
		},
		changLang(){
			cm.setOption('mode',this.lang)
		},
		loadFiles(){
			this.fileCnt=0
			this.fileList=[]
			for (var i=0; i<localStorage.length; ++i){
				const key=localStorage.key(i)
				if (key.indexOf('file_')==0){
					++this.fileCnt
					this.fileList.push(key.substr(5))
				}
			}
		},
		loadFile(i){
			cm.setValue(localStorage.getItem('file_'+this.fileList[i]))
		},
		saveFile(){
			const fileName=prompt('File name:')
			localStorage.setItem('file_'+fileName,this.code)
			this.loadFiles()
		},
		deleteFile(){
			const fileName=prompt('File name:')
			localStorage.removeItem('file_'+fileName)
			this.loadFiles()
		}
	},
	mounted(){
		this.sandBox=document.getElementById(this.id).contentWindow
		this.loadFiles()
	}
})
if ('serviceWorker' in navigator){
	navigator.serviceWorker.register('sw.js')
}
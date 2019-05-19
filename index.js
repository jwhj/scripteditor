var cm
const argv={}
location.search.substr(1).split('&').forEach(str=>{
	const a=str.split('=')
	argv[a[0]]=a[1]
})
console.log(argv)
function utoa(s){
	return btoa(unescape(encodeURIComponent(s)))
}
function atou(s){
	return decodeURIComponent(escape(atob(s)))
}
function encode(s){
	return utoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=/g,'')
}
function decode(s){
	return atou(s.replace(/_/g,'/').replace(/-/g,'+').replace(/`/g,''))
}
const editor={
	template:'#editorTpl',
	props:['value'],
	methods:{
	},
	mounted(){
		cm=this.cm=CodeMirror.fromTextArea(document.getElementById('blabla'),{
			lineNumbers:true,
			theme:'monokai',
			mode:argv.lang || 'javascript'
		})
		this.cm.on('change',()=>{
			this.value=this.cm.getValue()
			this.$emit('input',this.value)
		})
		if (argv.code) this.cm.setValue(decode(argv.code))
	}
}
Vue.component('editor',editor)
const vm=new Vue({
	el:'#app',
	data:{
		code:'',
		id:'fsd',
		lang:argv.lang || 'javascript',
		showMenu:false,
		beginTime:new Date(),
		consoleFullscreen:false,
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
			if (!fileName) return
			localStorage.setItem('file_'+fileName,this.code)
			this.loadFiles()
		},
		deleteFile(){
			const fileName=prompt('File name:')
			if (!fileName) return
			localStorage.removeItem('file_'+fileName)
			this.loadFiles()
		},
		chkLongTap(){
			var T=new Date()-this.beginTime
			if (T>=300){
				// alert(T)
				this.consoleFullscreen=!this.consoleFullscreen
			}
			else this.showMenu=!this.showMenu
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
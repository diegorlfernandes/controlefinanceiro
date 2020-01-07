

addCategoria = function(nome){    
	db.collection("categoria").add({
		nome: nome
	})
	.then(function(docRef) {
		toastr.success('Registro Adicionado com Sucesso.', 'Cash');
	})
	.catch(function(error) {
		toastr.error('O Registro não foi adicionado. - erro: '+error, 'Cash');
	});
}


listarCategoria = function(callback){
	db.collection("categoria").get().then(function(querySnapshot) 
	{
		return callback(querySnapshot);
  
});
}

//listarCategoria = function(){
//	db.collection("categoria").get().then(function(querySnapshot) {
//    querySnapshot.forEach(function(doc) {
//        // doc.data() is never undefined for query doc snapshots
//        console.log(doc.id, " => ", doc.data());
 //   });
//});
//}



// db.collection("cities").where("capital", "==", true)
//     .get()
//     .then(function(querySnapshot) {
//         querySnapshot.forEach(function(doc) {
//             // doc.data() is never undefined for query doc snapshots
//             console.log(doc.id, " => ", doc.data());
//         });
//     })
//     .catch(function(error) {
//         console.log("Error getting documents: ", error);
//     });

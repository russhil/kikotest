import React, { useEffect, useState } from 'react'

function ImageItem({defaultText,overlayText,id,onChange,name}) {
    const cameraPermission = localStorage.getItem("camera-permission-granted") ?? "";
    const [innerHtml,setInnerHtml] = useState("")
    const [openCamera,setOpenCamera] = useState(false);
    const [star, setStar] = useState(false)
    const onclickhere = async ()=>{
        if (cameraPermission === "true") {
            document.getElementById(`${id}-input`).click();
        }else{
            takePermission();
        }
    }

    useEffect(() => {
      setInnerHtml(defaultText)
      if(innerHtml?.slice(-1) === "*"){
       setStar(true)
      }
     }, [])

    useEffect(() => {
      if(openCamera){
        setTimeout(() => {
            document.getElementById(`${id}-input`).click();
        }, 500);
      } 
    }, [openCamera])
    

    function takePermission(){
        if (window?.flutter_inappwebview) {
            window.flutter_inappwebview
              .callHandler("fetchCameraPermission")
              .then((res) => {
               if(res){
                   localStorage.setItem("camera-permission-granted","true");
                   setOpenCamera(true);
                }else{
                   localStorage.setItem(
                     "camera-permission-granted", "false");
               }
              })
              .catch((error) => {
                console.error("Error fetching camera permission:", error);
                localStorage.setItem("camera-permission-granted", "false");
                // Handle error appropriately, such as displaying an error message
                alert("Error fetching camera permission. Please try again later.");
              });
            }
    }

    function onInputChange(e){
        const file = e.target.files[0];
        onChange({file, id, name});
        if(file){
            const reader = new FileReader();
			reader.addEventListener("load", function (e) {
				const readerTarget = e.target;
                const image = <div>
                    <small className='picture_label'>{overlayText}</small>
                    <img className='picture_image' src={readerTarget.result}/>
                    </div>
                setInnerHtml(image)
			});
			reader.readAsDataURL(file);
        }else{
            setInnerHtml(defaultText)
        }
    }
  return (
    <div className="certificate-img mt-3 me-0 me-md-3">

        <label className="picture" onClick={onclickhere} tabIndex="0">
          {!star ? (
            <span className="picture_image">{innerHtml}</span>
            ):(
            <span className="did-floating-label-image relative">{innerHtml.slice(0,-1)}<span className="required-field-star" style={{fontSize:"14px"}}>*</span></span>
          )}
        </label>

        <input id={`${id}-input`} type="file" accept="image/png, image/jpeg" className='none' onChange={onInputChange}/>
    </div>
  )
}

export default ImageItem

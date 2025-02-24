import Swal from 'sweetalert2/dist/sweetalert2.js'

export const alertMsg = (msg, type = "success") => {
    Swal.fire({
        title: msg,
        text: "",
        icon: type
    });
}

export const confirmation = (msg = "ต้องการลบข้อมูล ?") => {
    return Swal.fire({
        title: msg,
        text: "",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก"
    });
};

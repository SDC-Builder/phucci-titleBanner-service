import $ from 'jquery';


const request = {
  updateTittle: (id, newTittle) => {
    $.ajax({
      url: `/api/updateTittle/${id}`,
      type: 'PUT',
      data: { tittle: newTittle },
      success: () => console.log('update success'),
      error: () => console.log('failed to update')
    })
  }
}

export default request;
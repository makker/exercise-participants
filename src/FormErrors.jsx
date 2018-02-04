import React from 'react';

const FormErrors = ({formErrors}) => 
  {
    return Object.keys(formErrors).map((fieldName, i) => {
      if(formErrors[fieldName].length > 0){
        return (
          <tr className="formError" key={i}>
            <td colspan="4">
              <p>{fieldName} {formErrors[fieldName]}</p>
            </td>
          </tr>
        )        
      } else {
        return null;
      }
    });
  }

export default FormErrors;
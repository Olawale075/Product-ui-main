export const BASE_URL = 'http://146.70.88.25:8082/api/v1/'

export const SMS_URL = `${BASE_URL}sms/`
export const TEMPLATE_URL = `${SMS_URL}template`
// export const VARIABLE_URLs = `http://146.70.88.25:8082/api/v1/variable`
// 'http://localhost:8080/api/v1/product'
export const VARIABLE_URL = `http://localhost:8080/api/v1/product`
export const getVariables = (page=0, size=50) => {
    
    return (
        fetch(`${VARIABLE_URL}?page=${page}&size=${size}`)
        .then(res => res.json())
        .then(data => data)
    )
}

export const getTemplate = id => {
    return (
        fetch(`http://146.70.88.25:8082/api/v1/sms/template/${id}`)
        .then(res => res.json())
        .then(data => data)
    )
}

export const getSMSTypes = () => {
    return (
        fetch(`${TEMPLATE_URL}/smstype`)
        .then(res => res.json())
        .then(data => data)
    )
}

export const getLanguageTypes = () => {
    return (
        fetch(`${TEMPLATE_URL}/languagetype`)
        .then(res => res.json())
        .then(data => data)
    )
}

export const getFileSeparator = () => {
    return (
        fetch(`${TEMPLATE_URL}/fileseparator`)
        .then(res => res.json())
        .then(data => data)
    )
}

export const getDeliveryStatus = () => {
    return (
        fetch(`${SMS_URL}message/template/status`)
        .then(res => res.json())
        .then(data => data)
    )
}
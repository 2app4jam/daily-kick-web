import axios from 'axios';

interface AuthRequest {
  userId: string;
  password: string;
}

// 회원가입 함수
export const signUp = async (signupData: AuthRequest) => {
  try {
    const requestData = {
      user_id: signupData.userId,
      password: signupData.password,
    };

    const { data } = await axios.post('http://172.16.20.82:8000/auth/sign-up', requestData);
    console.log('회원가입 응답 데이터:', data); // 디버깅 로그
    return data;
  } catch (error: any) {
    console.error('회원가입 에러 응답:', error.response?.data);

    if (error.response?.status === 400) {
      alert('이미 있는 아이디입니다.');
      throw new Error('이미 있는 아이디입니다.');
    }

    throw new Error('회원가입에 실패했습니다.');
  }
};

// 로그인 함수
export const signIn = async (signinData: AuthRequest) => {
  try {
    const requestData = {
      user_id: signinData.userId,
      password: signinData.password,
    };

    const { data } = await axios.post('http://172.16.20.82:8000/auth/sign-in', requestData);
    console.log('로그인 응답 데이터:', data); // 디버깅 로그

    // 응답에서 토큰 가져오기
    const { access_token: token, refresh_token } = data;

    if (!token || !refresh_token) {
      console.error('토큰이 반환되지 않았습니다.');
      throw new Error('토큰이 반환되지 않았습니다.');
    }

    // 토큰을 로컬 스토리지에 저장
    localStorage.setItem('authToken', token);
    localStorage.setItem('refreshToken', refresh_token);

    // 저장 확인 로그
    console.log('authToken 저장 확인:', localStorage.getItem('authToken'));
    console.log('refreshToken 저장 확인:', localStorage.getItem('refreshToken'));

    return data;
  } catch (error: any) {
    console.error('로그인 에러 응답:', error.response?.data || error.message);

    if (error.response?.status === 400) {
      alert('로그인 정보가 올바르지 않습니다.');
      throw new Error('로그인 정보가 올바르지 않습니다.');
    }

    throw new Error('로그인에 실패했습니다.');
  }
};

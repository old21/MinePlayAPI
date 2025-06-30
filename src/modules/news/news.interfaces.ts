export interface Anchor {
  id: string;
  icon: string;
  name: string;
}

export interface Vote {
  name: string;
  questions: VoteQuestion[];
}

interface VoteQuestion {
  id: string;
  name: string;
  asked: string[];
}
